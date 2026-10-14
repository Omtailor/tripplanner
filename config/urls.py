from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.views.defaults import page_not_found, server_error
from itinerary.views import RateLimitView


# Railway pings this to check if app is alive
def health_check(request):
    return JsonResponse({"status": "ok"})


def handler404(request, exception):
    if request.path.startswith("/api/"):
        return JsonResponse({"detail": "Not found"}, status=404)
    return page_not_found(request, exception)


def handler500(request):
    if request.path.startswith("/api/"):
        return JsonResponse({"detail": "Internal server error"}, status=500)
    return server_error(request)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/itinerary/", include("itinerary.urls")),
    path("api/rate-limit/", RateLimitView.as_view()),
    path("health/", health_check),
]
