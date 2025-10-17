"""Minimal FastAPI application with HTTP and WebSocket endpoints."""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI(title="nome.ai backend")


@app.get("/")
async def read_root() -> dict[str, str]:
    """Health-check style endpoint for quickly verifying the API is up."""
    return {"status": "ok"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    """Accepts a client WebSocket connection and echoes inbound messages."""
    await websocket.accept()
    try:
        while True:
            message = await websocket.receive_text()
            await websocket.send_text(f"echo: {message}")
    except WebSocketDisconnect:
        # Client closed the connection; nothing else to do here.
        return
