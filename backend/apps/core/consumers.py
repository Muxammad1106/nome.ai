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
