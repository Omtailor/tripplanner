from django.db import models
from django.conf import settings


# ── Trip ──────────────────────────────────────────────────────
class Trip(models.Model):

    BUDGET_CHOICES = [
        ("low", "Low"),
        ("mid", "Mid"),  # FIX — was "medium", gemini_service uses "mid"
        ("high", "High"),
    ]
    VIBE_CHOICES = [
        ("relax", "Relax"),
        ("adventure", "Adventure"),
        ("culture", "Culture"),
        ("mixed", "Mixed"),
    ]
    GROUP_CHOICES = [
        ("solo", "Solo"),
        ("couple", "Couple"),
        ("friends", "Friends"),
        ("family", "Family"),
    ]
    MEAL_CHOICES = [
        ("veg", "Veg"),
        ("non-veg", "Non-Veg"),
    ]
    DETAIL_CHOICES = [
        ("detailed", "Detailed"),
        ("medium", "Medium"),
        ("compact", "Compact"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="trips",
    )
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    days = models.PositiveIntegerField()
    travelers = models.PositiveIntegerField(default=1)  # FIX — added
    group_type = models.CharField(max_length=10, choices=GROUP_CHOICES)
    meal_pref = models.CharField(max_length=10, choices=MEAL_CHOICES)
    vibe = models.CharField(max_length=15, choices=VIBE_CHOICES)
    budget_tier = models.CharField(max_length=10, choices=BUDGET_CHOICES)
    detail_level = models.CharField(max_length=10, choices=DETAIL_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} → {self.destination} ({self.days} days)"

    class Meta:
        ordering = ["-created_at"]


# ── Itinerary ─────────────────────────────────────────────────
class Itinerary(models.Model):

    trip = models.OneToOneField(
        Trip,
        on_delete=models.CASCADE,
        related_name="itinerary",
    )
    days_data = models.JSONField()
    version = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Itinerary v{self.version} for {self.trip.destination}"

    class Meta:
        ordering = ["-created_at"]


# ── Day Regeneration Log ─────────────────────────────────────
class DayRegeneration(models.Model):

    itinerary = models.ForeignKey(
        Itinerary,
        on_delete=models.CASCADE,
        related_name="day_regenerations",
    )
    day_number = models.PositiveIntegerField()
    old_json = models.JSONField()
    new_json = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Regen Day {self.day_number} of Itinerary #{self.itinerary.id}"

    class Meta:
        ordering = ["-created_at"]
