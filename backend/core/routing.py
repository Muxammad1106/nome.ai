"""WebSocket routing for the core app."""
from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path("ws/echo/", consumers.EchoConsumer.as_asgi()),
    path("ws/person/", consumers.PersonEventsConsumer.as_asgi()),
]
