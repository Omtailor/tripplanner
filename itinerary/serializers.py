from rest_framework import serializers
from .models import Trip, Itinerary, DayRegeneration


class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = [
            "id",
            "origin",
            "destination",
            "start_date",
            "end_date",
            "days",
            "travelers",        # FIX — added
            "group_type",
            "meal_pref",
            "vibe",
            "budget_tier",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class ItinerarySerializer(serializers.ModelSerializer):
    trip        = TripSerializer(read_only=True)
    days        = serializers.SerializerMethodField()
    summary     = serializers.SerializerMethodField()
    created_at  = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Itinerary
        fields = ["id", "trip", "days", "summary", "created_at"]
        read_only_fields = ["id", "created_at"]

    def get_days(self, obj):
        data = obj.days_data or {}
        return data.get("days", [])

    def get_summary(self, obj):
        data = obj.days_data or {}
        return data.get("summary", {})


class DayRegenerationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DayRegeneration
        fields = [
            "id", "itinerary", "day_number",
            "old_json", "new_json", "created_at",
        ]
        read_only_fields = ["id", "created_at"]
