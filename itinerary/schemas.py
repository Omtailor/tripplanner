import re
from datetime import datetime
from pydantic import BaseModel, Field, field_validator, model_validator
from typing import List, Literal, Optional

# ── Type aliases ────────────────────────────────────────────
VibeType = Literal["relax", "adventure", "culture"]
BudgetTier = Literal["low", "mid", "high"]
GroupType = Literal["solo", "couple", "friends", "family"]
MealPref = Literal["veg", "non-veg"]


# ── Single activity inside a day ────────────────────────────
class Activity(BaseModel):
    time: str
    name: str
    description: str
    location: str
    region: str
    cost_inr: int
    vibe: VibeType
    duration_minutes: int

    # BUG 9 FIX — normalize time to 24-hour HH:MM format
    @field_validator("time", mode="before")
    @classmethod
    def normalize_time(cls, v: str) -> str:
        if not v:
            return "09:00"
        v = str(v).strip()
        # Already valid HH:MM 24-hour format
        if re.match(r"^\d{2}:\d{2}$", v):
            return v
        # Handle H:MM format (missing leading zero)
        if re.match(r"^\d{1}:\d{2}$", v):
            return f"0{v}"
        # Handle 12-hour AM/PM formats like "9:00 AM", "09:00 AM", "9:00AM"
        v_clean = v.upper().replace(" ", "")
        match = re.match(r"^(\d{1,2}):(\d{2})(AM|PM)$", v_clean)
        if match:
            hour, minute, period = int(match.group(1)), match.group(2), match.group(3)
            if period == "AM":
                hour = 0 if hour == 12 else hour
            else:
                hour = 12 if hour == 12 else hour + 12
            return f"{hour:02d}:{minute}"
        # Fallback — try parsing with datetime
        for fmt in ["%I:%M %p", "%I:%M%p", "%H:%M"]:
            try:
                return datetime.strptime(v, fmt).strftime("%H:%M")
            except ValueError:
                continue
        return "09:00"


# ── One full day plan ────────────────────────────────────────
class DayPlan(BaseModel):
    day_number: int
    date: str
    theme: str
    region_of_day: str
    vibes_of_day: List[VibeType] = Field(min_length=1, max_length=2)
    activities: List[Activity]
    breakfast: str
    lunch: str
    dinner: str
    accommodation: Optional[str] = None
    accommodation_cost_inr: int
    local_transport_note: Optional[str] = None
    local_transport_cost_inr: int
    day_total_cost_inr: int

    # BUG 15 FIX — default null/empty transport_notes to walkable string
    @field_validator("local_transport_note", mode="before")
    @classmethod
    def default_transport(cls, v) -> str:
        if not v or str(v).strip() == "":
            return "Walking within the area."
        return str(v)

    # BUG 15 FIX — also handle null accommodation
    @field_validator("accommodation", mode="before")
    @classmethod
    def default_accommodation(cls, v) -> str:
        if not v or str(v).strip() == "":
            return "N/A"
        return str(v)


# ── Trip summary at the end ──────────────────────────────────
class TripSummary(BaseModel):
    destination: str
    origin: str
    total_days: int
    budget_tier: BudgetTier
    intercity_travel_cost_inr: int
    local_transport_total_inr: int
    accommodation_total_inr: int
    food_total_inr: int
    activities_total_inr: int
    grand_total_inr: int
    travel_tips: List[str] = Field(min_length=3, max_length=5)


# ── Full itinerary response (root model) ─────────────────────
class ItineraryResponse(BaseModel):
    days: List[DayPlan]
    summary: TripSummary

    @model_validator(mode="after")
    def validate_day_count(self):
        assert len(self.days) >= 1, "At least 1 day must be present"
        return self
