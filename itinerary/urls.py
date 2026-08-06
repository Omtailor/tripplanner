from django.urls import path
from .views import (
    GenerateItineraryView,
    RegenerateDayView,
    ItineraryHistoryView,
    RateLimitView,
    ItineraryDetailView,
    DeleteItineraryView,
)

urlpatterns = [
    path("generate/", GenerateItineraryView.as_view(), name="generate"),
    path("<int:pk>/", ItineraryDetailView.as_view(), name="detail"),
    path("<int:pk>/regen-day/", RegenerateDayView.as_view(), name="regen-day"),
    path(
        "<int:pk>/delete/", DeleteItineraryView.as_view(), name="delete"
    ),
    path("history/", ItineraryHistoryView.as_view(), name="history"),
    path("rate-limit/", RateLimitView.as_view(), name="rate-limit"),
]
