"""HTTP views for the core app."""
from django.http import JsonResponse


def health_check(request):
    """Simple JSON response used as application health endpoint."""
    return JsonResponse({"status": "ok"})
