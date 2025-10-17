"""ASGI application entrypoint for Django + Channels."""
import os
from typing import Any

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

django_application = get_asgi_application()

try:
    from core import routing as core_routing
except Exception:  # pragma: no cover - fallback if app misconfigured
    core_routing = None

websocket_urlpatterns: list[Any] = []
if core_routing and hasattr(core_routing, "websocket_urlpatterns"):
    websocket_urlpatterns = core_routing.websocket_urlpatterns

application = ProtocolTypeRouter(
    {
        "http": django_application,
        "websocket": AuthMiddlewareStack(
            URLRouter(websocket_urlpatterns),
        ),
    }
)
