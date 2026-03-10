import json
import re
from datetime import date, timedelta
from typing import Any, Optional

import requests
from decouple import config

from .schemas import ItineraryResponse, DayPlan

OPENROUTER_BASE_URL = config(
    "OPENROUTER_BASE_URL",
    default="https://openrouter.ai/api/v1",
).rstrip("/")
OPENROUTER_API_KEY = config("OPENROUTER_API_KEY", default=None) or config(
    "GEMINI_API_KEY", default=None
)
OPENROUTER_MODEL = config(
    "OPENROUTER_MODEL",
    default="google/gemini-2.0-flash-001",
)
OPENROUTER_REFERRER = config("OPENROUTER_REFERRER", default="http://localhost:8000")
OPENROUTER_APP_NAME = config("OPENROUTER_APP_NAME", default="TripPlanner")
OPENROUTER_TIMEOUT_SECONDS = config(
    "OPENROUTER_TIMEOUT_SECONDS", default=60, cast=int
)


# ── BUG 3 FIX — Intercity cost estimator ────────────────────
def estimate_intercity_cost(
    origin: str,
    destination: str,
    budget: str,
    travelers: int,
) -> int:
    """
    Estimates round-trip intercity travel cost for the entire group.
    Returns 0 for same-city trips.
    """
    if origin.strip().lower() == destination.strip().lower():
        return 0

    # Approximate distance table (km) for common Indian city pairs
    # Falls back to category-based estimate if pair not found
    KNOWN_DISTANCES = {
        frozenset(["mumbai", "goa"]): 590,
        frozenset(["pune", "goa"]): 450,
        frozenset(["delhi", "jaipur"]): 280,
        frozenset(["delhi", "agra"]): 230,
        frozenset(["delhi", "manali"]): 540,
        frozenset(["delhi", "shimla"]): 350,
        frozenset(["delhi", "amritsar"]): 450,
        frozenset(["delhi", "varanasi"]): 820,
        frozenset(["mumbai", "pune"]): 150,
        frozenset(["mumbai", "nashik"]): 170,
        frozenset(["mumbai", "aurangabad"]): 340,
        frozenset(["mumbai", "kolhapur"]): 380,
        frozenset(["bangalore", "mysore"]): 150,
        frozenset(["bangalore", "ooty"]): 270,
        frozenset(["bangalore", "coorg"]): 260,
        frozenset(["bangalore", "hampi"]): 340,
        frozenset(["chennai", "pondicherry"]): 170,
        frozenset(["chennai", "madurai"]): 460,
        frozenset(["hyderabad", "warangal"]): 145,
        frozenset(["kolkata", "darjeeling"]): 620,
        frozenset(["kolkata", "puri"]): 500,
        frozenset(["delhi", "leh"]): 1050,
        frozenset(["mumbai", "kerala"]): 1200,
        frozenset(["delhi", "kerala"]): 2800,
        frozenset(["bhopal", "kerala"]): 1900,
        frozenset(["mumbai", "andaman"]): 2400,
    }

    key = frozenset([origin.strip().lower(), destination.strip().lower()])
    dist = KNOWN_DISTANCES.get(key)

    # Cost per person one-way by distance band and budget
    if dist is not None:
        if dist < 500:
            per_person = {"low": 800, "mid": 1500, "high": 3000}[budget]
        elif dist < 1500:
            per_person = {"low": 1500, "mid": 3000, "high": 8000}[budget]
        else:
            per_person = {"low": 3000, "mid": 6000, "high": 15000}[budget]
    else:
        # Unknown pair — default to mid-distance estimate
        per_person = {"low": 1500, "mid": 3000, "high": 8000}[budget]

    # Round trip × travelers
    return per_person * 2 * travelers


# ── Detail level based on number of days ────────────────────
def get_detail_instruction(days: int) -> str:
    if days <= 5:
        return (
            "DETAIL LEVEL: DETAILED. "
            "Provide hour-by-hour breakdown. Include specific restaurant "
            "names, exact entry fees, opening hours, and rich descriptions."
        )
    elif days <= 10:
        return (
            "DETAIL LEVEL: MEDIUM. "
            "Divide each day into morning, afternoon, evening blocks. "
            "Include named restaurants and activity descriptions."
        )
    else:
        return (
            "DETAIL LEVEL: COMPACT. "
            "List 3 key activities per day with brief one-line descriptions. "
            "No hour-by-hour breakdown needed."
        )


# ── Vibe instructions ────────────────────────────────────────
def get_vibe_instruction(vibe: str, days: int) -> str:
    if vibe != "mixed":
        return (
            f"VIBE MODE: SINGLE. "
            f"Apply '{vibe}' vibe to ALL days and ALL activities."
        )
    min_each = days // 3
    return f"""
VIBE MODE: MIXED — All 3 vibes MUST be included.
- Rotate daily using this exact pattern:
  Day 1 → [relax, adventure]
  Day 2 → [culture, relax]
  Day 3 → [adventure, culture]
  Then repeat this pattern for remaining days.
- Max 2 vibes per day in vibes_of_day field. Never assign 3.
- Each vibe must appear at least {min_each} times across {days} days.
- Align vibes to regions naturally:
  culture   → heritage zones, old towns, museums
  relax     → beaches, scenic areas, spas, lakes
  adventure → trekking zones, water sports, outdoor terrain
"""


# ── Budget guidelines ────────────────────────────────────────
def get_budget_guidelines(budget: str, group: str) -> str:
    guidelines = {
        "low": (
            "Travel: Sleeper train or state bus only.\n"
            "Hotel: ₹800–₹2500/night (hostels, budget guesthouses, dorms).\n"
            "Food: Street food and local dhabas only. No restaurants.\n"
            "Activities: Free attractions only (beaches, temples, viewpoints).\n"
            "Goal: Absolute minimum realistic cost. Squeeze every rupee."
        ),
        "mid": (
            "Travel: AC train or budget domestic flight if needed.\n"
            "Hotel: ₹2500–₹6000/night (3-star, clean mid-range hotels).\n"
            "Food: Mix of local restaurants and casual sit-down dining.\n"
            "Activities: Mix of paid and free experiences allowed.\n"
            "Goal: Comfortable trip without overspending."
        ),
        "high": (
            "Travel: Economy or Business class domestic flights.\n"
            "Hotel: ₹8000+/night (5-star, boutique, luxury resorts).\n"
            "Food: Fine dining, rooftop restaurants, curated experiences only.\n"
            "No generic descriptions like 'local dhaba', 'roadside eatery',\n"
            "or 'street vendor' are acceptable for high-budget trips.\n"
            "Activities: Premium — private tours, chartered boats, spa.\n"
            "Goal: Best possible experience, cost is not a concern."
        ),
    }
    return (
        f"{guidelines[budget]}\n"
        f"Group type is '{group}' — adjust room count, "
        f"activity suitability and costs accordingly."
    )


# ── Geographic clustering rules ──────────────────────────────
GEOGRAPHIC_RULES = """
STRICT GEOGRAPHIC CONSTRAINTS — MUST FOLLOW WITHOUT EXCEPTION:

1. IDENTIFY REGIONS FIRST: Before planning, mentally divide the destination
   into its natural geographic sub-regions (north zone, south zone,
   old town, coastal belt, hill zone, heritage area, etc.)

2. ONE REGION PER DAY: Every activity, meal, and accommodation for a
   given day must fall within ONE geographic sub-region only.
   Set region_of_day AND each activity's region to the SAME value.

3. NO FAR-APART LOCATIONS: Never combine two locations more than
   25-30 km apart in the same day.

4. MINIMIZE INTRA-DAY TRAVEL: Total travel time within a single day
   must not exceed 1.5 hours. Plan activities in logical flow
   (A → B → C), never backtracking.

5. ROTATE REGIONS DAILY: Each consecutive day must cover a DIFFERENT
   sub-region. User must explore different parts progressively.
"""


# ── BUG 11 FIX — Activity count limits ──────────────────────
def get_activity_limit(days: int) -> int:
    if days == 1:
        return 5
    elif days <= 3:
        return 6
    elif days <= 7:
        return 7
    else:
        return 8


# ── Main prompt builder ──────────────────────────────────────
def build_prompt(trip: dict) -> str:
    days        = trip["days"]
    destination = trip["destination"]
    origin      = trip["origin"]
    budget      = trip["budget"]
    group       = trip["group_type"]
    meal_pref   = trip["meal_pref"]
    travelers   = trip.get("travelers", 1)
    start_date  = trip["start_date"]  # datetime.date or "YYYY-MM-DD" string

    # BUG 1 FIX — generate all dates server-side
    if isinstance(start_date, str):
        start_date = date.fromisoformat(start_date)
    date_list = [
        (start_date + timedelta(days=i)).isoformat()
        for i in range(days)
    ]
    date_block = "\n".join(
        f"  Day {i+1} → {d}" for i, d in enumerate(date_list)
    )
    final_day = days  # alias for readability

    # BUG 3 FIX — compute intercity cost server-side
    intercity_cost = estimate_intercity_cost(origin, destination, budget, travelers)

    # BUG 19 FIX — staycation detection
    is_staycation = origin.strip().lower() == destination.strip().lower()
    staycation_rule = (
        "STAYCATION MODE: Origin and destination are the same city. "
        "There is NO intercity travel. intercity_travel_cost_inr MUST be 0. "
        "Do NOT generate any arrival or departure transport activity."
        if is_staycation else ""
    )

    activity_limit = get_activity_limit(days)
    schema = ItineraryResponse.model_json_schema()

    return f"""
You are an expert Indian travel planner. Generate a complete trip itinerary.

═══════════════════════════════════════════════
TRIP DETAILS
═══════════════════════════════════════════════
Destination    : {destination}
Origin         : {origin}
Duration       : {days} days
Group Type     : {group}
Travelers      : {travelers}
Meal Preference: {meal_pref}
Budget Tier    : {budget}

═══════════════════════════════════════════════
DATE RULES — CRITICAL
═══════════════════════════════════════════════
Use ONLY these exact dates. Never compute or infer dates yourself.
Never return a year other than the one shown below.
{date_block}

═══════════════════════════════════════════════
COST RULES — CRITICAL
═══════════════════════════════════════════════
1. intercity_travel_cost_inr for this trip is exactly ₹{intercity_cost}.
   Use this exact value. Do not change it.

2. grand_total_inr MUST equal the exact arithmetic sum of all
   day_total_cost_inr values. Verify this before returning.

3. day_total_cost_inr for each day must equal EXACTLY:
   sum of all activity cost_inr
   + estimated meal costs (breakfast + lunch + dinner)
   + accommodation_cost_inr
   + local_transport_cost_inr
   No unitemized buffers, tips, or miscellaneous charges.

4. Every cost must be the TOTAL for all {travelers} travelers combined.
   Never use per-person rates. Multiply by {travelers} before writing
   any cost_inr value.

5. cost_inr for free activities must be exactly 0.
   Never add implicit entry, tip, or miscellaneous costs.

6. accommodation_cost_inr is the cost for ONE night only.
   Do not prorate across the full stay.

═══════════════════════════════════════════════
SCHEDULE RULES
═══════════════════════════════════════════════
1. All activity times must use 24-hour HH:MM format (e.g., 09:00, 14:30).
   Never use AM/PM. Never use single-digit hours.

2. All activities must fit within 07:00 to 22:00.
   Last activity must end (start time + duration_minutes) by 22:00.

3. No unexplained gap of more than 90 minutes between consecutive
   activities. Fill gaps with a travel activity, meal, or rest period.

4. Maximum activities per day: {activity_limit}.
   Never exceed this limit regardless of trip length.

5. On Day {final_day} (FINAL DAY): Do NOT include any accommodation
   check-in activity. If luggage storage is needed, suggest railway
   station cloak room or hotel luggage facility.
   accommodation field on final day must be "Departure Day".

6. On any day where intercity travel occurs in the morning,
   breakfast must be at the departure city or described as
   'en route'. Never place breakfast at the destination city
   if departure is before 10:00 AM.

7. If a day involves a day trip to a nearby location and return,
   accommodation for that night must be at the BASE city hotel,
   not at the day-trip destination.

═══════════════════════════════════════════════
CONTENT RULES
═══════════════════════════════════════════════
1. FOOD CONSTRAINT — HARD RULE:
   food_preference is '{meal_pref}'.
   {"Every meal must be at a vegetarian-only or vegetarian-friendly restaurant. Never recommend a seafood shack, meat restaurant, or non-veg dhaba." if meal_pref == "veg" else "All meal recommendations should be appropriate for non-vegetarian diners."}

2. NO DUPLICATE ATTRACTIONS:
   Every attraction, landmark, temple, fort, beach, museum, or natural
   site must appear on AT MOST one day. Do not repeat any location
   even with a different spelling or name variation.
   (e.g., 'Amber Fort' and 'Amer Fort' are the same place.)

3. transport_notes must always be a non-empty string.
   If no vehicle is required, write 'Walking within the area.'

{staycation_rule}

═══════════════════════════════════════════════
DETAIL & STYLE
═══════════════════════════════════════════════
{get_detail_instruction(days)}

{get_vibe_instruction(trip["vibe"], days)}

BUDGET GUIDELINES:
{get_budget_guidelines(budget, group)}

{GEOGRAPHIC_RULES}

═══════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════
- Respond ONLY with a valid JSON object.
- Do NOT include any text, explanation, or markdown before or after JSON.
- The JSON must exactly match this schema:
{json.dumps(schema, indent=2)}
"""


# ── Regenerate single day prompt ─────────────────────────────
def build_regen_prompt(
    trip: dict,
    day_number: int,
    old_day: dict,
    all_days: list,
) -> str:
    other_regions = [
        d["region_of_day"] for d in all_days
        if d["day_number"] != day_number
    ]
    old_activities = [a["name"] for a in old_day["activities"]]
    days      = trip["days"]
    travelers = trip.get("travelers", 1)
    meal_pref = trip["meal_pref"]
    budget    = trip["budget"]
    is_final  = day_number == days
    schema    = DayPlan.model_json_schema()

    # Compute the correct date for this day
    start_date = trip["start_date"]
    if isinstance(start_date, str):
        start_date = date.fromisoformat(start_date)
    correct_date = (start_date + timedelta(days=day_number - 1)).isoformat()

    return f"""
You are an expert Indian travel planner.
Regenerate ONLY Day {day_number} of a {trip['destination']} itinerary.

PREVIOUSLY GENERATED FOR THIS DAY (DO NOT REPEAT ANY OF THESE):
- Region used  : {old_day['region_of_day']}
- Activities   : {old_activities}
- Breakfast    : {old_day['breakfast']}
- Lunch        : {old_day['lunch']}
- Dinner       : {old_day['dinner']}
- Accommodation: {old_day['accommodation']}

CONSTRAINTS:
- date field MUST be exactly: {correct_date}
- Use a COMPLETELY DIFFERENT region from '{old_day['region_of_day']}'
- Do NOT repeat any activity, location, or restaurant from above list
- New region must also differ from adjacent days: {other_regions}
- Budget tier    : {budget}
- Meal preference: {meal_pref} (HARD constraint — no exceptions)
- Group type     : {trip['group_type']}
- Travelers      : {travelers}
- All cost_inr values must be totals for {travelers} travelers, not per-person
- All times must use 24-hour HH:MM format
- transport_notes must be a non-empty string
{"- This is the FINAL DAY: accommodation must be 'Departure Day'. No check-in activity." if is_final else ""}

{GEOGRAPHIC_RULES}

Respond ONLY with a valid JSON object matching this schema:
{json.dumps(schema, indent=2)}
"""


# ── JSON extraction helper ────────────────────────────────────
def _extract_json_object(text: str) -> str:
    text = text.strip()
    if text.startswith("```"):
        parts = [
            line for line in text.splitlines()
            if not line.strip().startswith("```")
        ]
        text = "\n".join(parts).strip()
    start = text.find("{")
    end   = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError(
            f"Model did not return a JSON object. Raw: {text[:500]}"
        )
    return text[start : end + 1]


# ── OpenRouter API call ──────────────────────────────────────
def _openrouter_chat_json(
    prompt: str,
    *,
    model: Optional[str] = None,
) -> dict[str, Any]:
    if not OPENROUTER_API_KEY:
        raise RuntimeError(
            "Missing OpenRouter API key. Set OPENROUTER_API_KEY (preferred) "
            "or GEMINI_API_KEY in your .env."
        )

    url = f"{OPENROUTER_BASE_URL}/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": OPENROUTER_REFERRER,
        "X-Title": OPENROUTER_APP_NAME,
    }
    payload: dict[str, Any] = {
        "model": model or OPENROUTER_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2,
        "response_format": {"type": "json_object"},
    }

    resp = requests.post(
        url, headers=headers, json=payload,
        timeout=OPENROUTER_TIMEOUT_SECONDS,
    )
    if resp.status_code < 200 or resp.status_code >= 300:
        body = resp.text.strip().replace("\r", "")
        raise RuntimeError(
            f"{resp.status_code} {resp.reason}. {body[:1500]}"
        )

    data    = resp.json()
    content = (
        data.get("choices", [{}])[0]
        .get("message", {})
        .get("content", "")
    )
    json_text = _extract_json_object(content)
    return json.loads(json_text)


# ── BUG 10 FIX — schedule overflow validator ─────────────────
def _validate_schedule(itinerary: ItineraryResponse) -> None:
    for day in itinerary.days:
        if not day.activities:
            continue
        last = day.activities[-1]
        try:
            h, m   = map(int, last.time.split(":"))
            end_m  = h * 60 + m + last.duration_minutes
            end_hh = end_m // 60
            end_mm = end_m % 60
            if end_hh > 22 or (end_hh == 22 and end_mm > 0):
                print(
                    f"[WARNING] Day {day.day_number}: last activity "
                    f"'{last.name}' ends at {end_hh:02d}:{end_mm:02d}, "
                    f"exceeding 22:00 cutoff."
                )
        except Exception:
            pass


# ── Core generation function ──────────────────────────────────
def generate_itinerary(trip: dict, max_retries: int = 0) -> ItineraryResponse:
    last_error = None
    start_date = trip["start_date"]
    if isinstance(start_date, str):
        start_date = date.fromisoformat(start_date)

    for attempt in range(max_retries + 1):
        try:
            raw        = _openrouter_chat_json(build_prompt(trip))
            itinerary  = ItineraryResponse(**raw)

            # BUG 1 FIX — overwrite dates server-side regardless of what
            # Gemini returned
            for i, day in enumerate(itinerary.days):
                correct = (start_date + timedelta(days=i)).isoformat()
                day.date = correct

            # BUG 2 FIX — always recompute grand total from day totals
            itinerary.summary.grand_total_inr = sum(
                d.day_total_cost_inr for d in itinerary.days
            )

            # BUG 3 FIX — always overwrite intercity cost with our estimate
            itinerary.summary.intercity_travel_cost_inr = (
                estimate_intercity_cost(
                    trip["origin"],
                    trip["destination"],
                    trip["budget"],
                    trip.get("travelers", 1),
                )
            )

            # BUG 10 FIX — log schedule overflow warnings
            _validate_schedule(itinerary)

            return itinerary

        except Exception as e:
            last_error = e
            print(f"Attempt {attempt + 1} failed: {e}")
            continue

    raise Exception(
        f"Itinerary generation failed after {max_retries + 1} "
        f"attempts. Last error: {last_error}"
    )


# ── Single day regeneration function ────────────────────────
def regenerate_day(
    trip: dict,
    day_number: int,
    old_day: dict,
    all_days: list,
    max_retries: int = 0,
) -> DayPlan:
    start_date = trip["start_date"]
    if isinstance(start_date, str):
        start_date = date.fromisoformat(start_date)
    correct_date = (start_date + timedelta(days=day_number - 1)).isoformat()

    last_error = None
    for attempt in range(max_retries + 1):
        try:
            raw = _openrouter_chat_json(
                build_regen_prompt(trip, day_number, old_day, all_days)
            )
            day = DayPlan(**raw)

            # BUG 1 FIX — enforce correct date after regen too
            day.date = correct_date

            return day

        except Exception as e:
            last_error = e
            print(f"Regen attempt {attempt + 1} failed: {e}")
            continue

    raise Exception(
        f"Day regeneration failed after {max_retries + 1} "
        f"attempts. Last error: {last_error}"
    )
