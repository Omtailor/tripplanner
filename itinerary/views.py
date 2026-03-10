import datetime
import traceback

from django.core.cache import cache
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .gemini_service import generate_itinerary, regenerate_day
from .models import DayRegeneration, Itinerary, Trip
from .serializers import ItinerarySerializer, TripSerializer
from .validators import run_all_validators, validate_regen_region


# ── Rate limiting helpers ─────────────────────────────────────
GENERATE_DAILY_LIMIT = 5
REGEN_DAILY_LIMIT    = 10

BLOCKED_TERMS = [
    "dubai", "london", "paris", "new york", "tokyo", "singapore",
    "bangkok", "sydney", "toronto", "new zealand", "australia",
    "usa", "uk", "france", "japan", "germany", "italy", "spain",
    "switzerland", "maldives", "bali", "phuket", "amsterdam",
    "abu dhabi", "doha", "istanbul", "cairo",
]


def _rate_limit_key(user_id: int, action: str) -> str:
    today = datetime.date.today().isoformat()
    return f"rate_limit_{action}_{user_id}_{today}"


def _get_limit_for(action: str) -> int:
    return GENERATE_DAILY_LIMIT if action == "generate" else REGEN_DAILY_LIMIT


def check_rate_limit(user_id: int, action: str) -> bool:
    key   = _rate_limit_key(user_id, action)
    count = cache.get(key, 0)
    return count < _get_limit_for(action)


def increment_rate_limit(user_id: int, action: str) -> None:
    key   = _rate_limit_key(user_id, action)
    count = cache.get(key, 0)
    cache.set(key, count + 1, timeout=86400)


def get_remaining(user_id: int, action: str) -> int:
    key   = _rate_limit_key(user_id, action)
    count = cache.get(key, 0)
    return _get_limit_for(action) - count


def get_used(user_id: int, action: str) -> int:
    key = _rate_limit_key(user_id, action)
    return cache.get(key, 0)


# ── Detail level helper ──────────────────────────────────────
def get_detail_level(days: int) -> str:
    if days <= 5:
        return "detailed"
    elif days <= 10:
        return "medium"
    return "compact"


# ── Input sanitizer ──────────────────────────────────────────
def sanitize_text(value: str, max_len: int = 100) -> str:
    return str(value).strip()[:max_len]


# ── View 1: Generate Full Itinerary ─────────────────────────
class GenerateItineraryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data

        # 1. Validate required fields
        required = [
            "origin", "destination", "start_date", "end_date",
            "days", "group_type", "meal_pref", "vibe", "budget_tier",
        ]
        for field in required:
            if field not in data:
                return Response(
                    {"error": f"Missing required field: {field}"}, status=400
                )

        # 2. Input sanitization
        origin      = sanitize_text(data["origin"])
        destination = sanitize_text(data["destination"])
        if not origin or not destination:
            return Response(
                {"error": "origin and destination must not be empty"},
                status=400,
            )

        # 3. Feature 1 — Block international destinations
        if len(destination) < 2:
            return Response({"error": "Invalid destination"}, status=400)

        if any(term in destination.lower() for term in BLOCKED_TERMS):
            return Response(
                {"error": "Only Indian destinations are supported currently."},
                status=400,
            )

        # 4. Check rate limit
        if not check_rate_limit(user.id, "generate"):
            return Response(
                {
                    "error": "Daily limit reached",
                    "remaining": 0,
                    "limit": GENERATE_DAILY_LIMIT,
                },
                status=429,
            )

        # 5. Parse and validate numeric fields
        try:
            days_int  = int(data["days"])
            travelers = int(data.get("travelers", 1))
        except (TypeError, ValueError):
            return Response(
                {"error": "days and travelers must be integers"}, status=400
            )

        if days_int < 1 or days_int > 30:
            return Response(
                {"error": "days must be between 1 and 30"}, status=400
            )
        if travelers < 1 or travelers > 20:
            return Response(
                {"error": "travelers must be between 1 and 20"}, status=400
            )

        # 6. Create Trip object
        detail_level = get_detail_level(days_int)
        trip = Trip.objects.create(
            user         = user,
            origin       = origin,
            destination  = destination,
            start_date   = data["start_date"],
            end_date     = data["end_date"],
            days         = days_int,
            travelers    = travelers,
            group_type   = data["group_type"],
            meal_pref    = data["meal_pref"],
            vibe         = data["vibe"],
            budget_tier  = data["budget_tier"],
            detail_level = detail_level,
        )

        # 7. Call Gemini and save itinerary
        try:
            trip_dict = {
                "destination" : destination,
                "origin"      : origin,
                "start_date"  : data["start_date"],
                "end_date"    : data["end_date"],
                "days"        : days_int,
                "travelers"   : travelers,
                "budget"      : data["budget_tier"],
                "vibe"        : data["vibe"],
                "group_type"  : data["group_type"],
                "meal_pref"   : data["meal_pref"],
            }
            itinerary_resp = generate_itinerary(trip_dict)

            # 8. Run validators
            run_all_validators(itinerary_resp.days, data["vibe"])

            # 9. Save Itinerary JSON
            itinerary = Itinerary.objects.create(
                trip      = trip,
                days_data = itinerary_resp.model_dump(),
                version   = 1,
                is_active = True,
            )

            # 10. Increment rate limit
            increment_rate_limit(user.id, "generate")

            serializer = ItinerarySerializer(itinerary)
            return Response(serializer.data, status=201)

        except Exception as e:
            traceback.print_exc()
            trip.delete()
            return Response({"error": str(e)}, status=500)


# ── View 2: Regenerate Single Day ───────────────────────────
class RegenerateDayView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        user = request.user

        # 1. Check rate limit
        if not check_rate_limit(user.id, "regen"):
            return Response(
                {
                    "error": "Daily limit reached",
                    "remaining": max(0, get_remaining(user.id, "regen")),
                    "limit": REGEN_DAILY_LIMIT,
                },
                status=429,
            )

        # 2. Get itinerary and verify ownership
        itinerary = get_object_or_404(Itinerary, id=pk)
        if itinerary.trip.user_id != user.id:
            return Response(
                {"error": "You do not have permission to access this itinerary."},
                status=403,
            )

        # 3. Validate request body
        day_number = request.data.get("day_number")
        if day_number is None:
            return Response({"error": "day_number is required"}, status=400)

        try:
            day_number = int(day_number)
        except (TypeError, ValueError):
            return Response(
                {"error": "day_number must be an integer"}, status=400
            )

        raw      = itinerary.days_data or {}
        all_days = raw.get("days", [])

        # 4. Find the old day
        old_day = next(
            (d for d in all_days if d.get("day_number") == day_number),
            None,
        )
        if not old_day:
            return Response(
                {"error": f"Day {day_number} not found in itinerary"},
                status=404,
            )

        # 5. Build trip dict for regen prompt
        tr = itinerary.trip
        trip_dict = {
            "destination" : tr.destination,
            "origin"      : tr.origin,
            "start_date"  : tr.start_date,
            "end_date"    : tr.end_date,
            "days"        : tr.days,
            "travelers"   : tr.travelers,
            "budget"      : tr.budget_tier,
            "vibe"        : tr.vibe,
            "group_type"  : tr.group_type,
            "meal_pref"   : tr.meal_pref,
        }

        # 6. Call Gemini for regen
        try:
            new_day = regenerate_day(trip_dict, day_number, old_day, all_days)

            # 7. Validate new day's region
            adjacent_regions = [
                d["region_of_day"]
                for d in all_days
                if d.get("day_number") in [day_number - 1, day_number + 1]
            ]
            validate_regen_region(
                new_day, old_day["region_of_day"], adjacent_regions
            )

            # 8. Save regen log
            DayRegeneration.objects.create(
                itinerary  = itinerary,
                day_number = day_number,
                old_json   = old_day,
                new_json   = new_day.model_dump(),
            )

            # 9. Update itinerary JSON + recalculate grand total
            updated_days = [
                new_day.model_dump()
                if d.get("day_number") == day_number else d
                for d in all_days
            ]
            raw["days"] = updated_days
            raw["summary"]["grand_total_inr"] = sum(
                d["day_total_cost_inr"] for d in updated_days
            )
            itinerary.days_data = raw
            itinerary.save()

            # 10. Increment regen rate limit
            increment_rate_limit(user.id, "regen")

            return Response(
                {
                    "day"       : new_day.model_dump(),
                    "remaining" : get_remaining(user.id, "regen"),
                    "limit"     : REGEN_DAILY_LIMIT,
                    "used"      : get_used(user.id, "regen"),
                },
                status=200,
            )

        except Exception:
            traceback.print_exc()
            return Response({"error": "Failed to regenerate day"}, status=500)


# ── View 3: Itinerary History ────────────────────────────────
class ItineraryHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        itineraries = (
            Itinerary.objects.select_related("trip")
            .filter(trip__user=request.user)
            .order_by("-trip__created_at")
        )
        serializer = ItinerarySerializer(itineraries, many=True)
        return Response(serializer.data, status=200)


# ── View 4: Rate Limit Status ────────────────────────────────
class RateLimitView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user          = request.user
        used_generate = get_used(user.id, "generate")
        used_regen    = get_used(user.id, "regen")

        return Response(
            {
                "remaining"      : max(0, GENERATE_DAILY_LIMIT - used_generate),
                "limit"          : GENERATE_DAILY_LIMIT,
                "used"           : used_generate,
                "regen_remaining": max(0, REGEN_DAILY_LIMIT - used_regen),
                "regen_limit"    : REGEN_DAILY_LIMIT,
                "regen_used"     : used_regen,
            },
            status=200,
        )


# ── View 5: Itinerary Detail ─────────────────────────────────
class ItineraryDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class   = ItinerarySerializer

    def get_object(self):
        return get_object_or_404(
            Itinerary,
            pk=self.kwargs["pk"],
            trip__user=self.request.user,
        )


# ── View 6: Delete Itinerary ─────────────────────────────────
class DeleteItineraryView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        itinerary = get_object_or_404(Itinerary, id=pk)
        if itinerary.trip.user_id != request.user.id:
            return Response(
                {"error": "You do not have permission to delete this itinerary."},
                status=403,
            )
        itinerary.trip.delete()  # cascades to Itinerary + DayRegeneration
        return Response({"message": "Itinerary deleted successfully."}, status=200)
