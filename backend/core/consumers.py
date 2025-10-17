"""WebSocket consumers for realtime features."""
from __future__ import annotations

from channels.generic.websocket import AsyncJsonWebsocketConsumer


class EchoConsumer(AsyncJsonWebsocketConsumer):
    """Echo back messages to demonstrate working WebSocket pipeline."""

    async def connect(self) -> None:
        await self.accept()
        await self.send_json({"message": "connected"})

    async def receive_json(self, content, **kwargs) -> None:  # type: ignore[override]
        await self.send_json({"echo": content})

    async def disconnect(self, code: int) -> None:
        await super().disconnect(code)


class PersonEventsConsumer(AsyncJsonWebsocketConsumer):
    """Broadcast person presence events."""

    group_name = "person_events"

    async def connect(self) -> None:
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code: int) -> None:
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        await super().disconnect(code)

    async def person_joined(self, event) -> None:
        await self.send_json(event.get("payload", {}))
