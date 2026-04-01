from collections import Counter
from .schemas import DayPlan


def validate_geographic_clustering(days: list) -> None:
    for day in days:
        activity_regions = {activity.region for activity in day.activities}
        if len(activity_regions) > 1:
            print(
                f"[WARNING] Day {day.day_number} mixes regions: "
                f"{activity_regions}. Expected: '{day.region_of_day}'."
            )
        if day.activities and day.activities[0].region != day.region_of_day:
            print(
                f"[WARNING] Day {day.day_number}: region_of_day is "
                f"'{day.region_of_day}' but first activity is in "
                f"'{day.activities[0].region}'."
            )
    print("✅ Geographic clustering check done.")


def validate_vibe_distribution(days: list) -> None:
    total_days = len(days)
    min_expected = max(1, total_days // 3)
    for day in days:
        if len(day.vibes_of_day) > 2:
            print(f"[WARNING] Day {day.day_number} has {len(day.vibes_of_day)} vibes.")
    all_vibes = [v for day in days for v in day.vibes_of_day]
    counts = Counter(all_vibes)
    for vibe in ["relax", "adventure", "culture"]:
        actual = counts.get(vibe, 0)
        if actual < min_expected:
            print(
                f"[WARNING] Vibe '{vibe}' only {actual}x " f"across {total_days} days."
            )
    print(f"✅ Vibe check done. Counts: {dict(counts)}")


def validate_regen_region(
    new_day: DayPlan,
    old_region: str,
    adjacent_regions: list,
) -> None:
    new_region = new_day.region_of_day
    if new_region == old_region:
        raise ValueError(
            f"Regenerated day still uses region '{new_region}'. "
            f"Must use a different region."
        )
    if new_region in adjacent_regions:
        print(
            f"[WARNING] Regen region '{new_region}' matches "
            f"adjacent day: {adjacent_regions}"
        )
    print(f"✅ Regen region '{new_region}' accepted.")


def run_all_validators(days: list, vibe_mode: str) -> None:
    validate_geographic_clustering(days)
    if vibe_mode == "mixed":
        validate_vibe_distribution(days)
