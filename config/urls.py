from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from itinerary.views import RateLimitView


# Railway pings this to check if app is alive
def health_check(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/itinerary/", include("itinerary.urls")),
    path("api/rate-limit/", RateLimitView.as_view()),
    path("health/", health_check),
]
