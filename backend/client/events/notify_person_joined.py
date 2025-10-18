from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def notify_person_joined(person_payload: dict) -> None:
    """Notify connected clients about a new person joining."""
    person_payload.pop("vector")

    channel_layer = get_channel_layer()
    if not channel_layer:
        return

    payload = {
        "event": "person_joined",
        "person": person_payload,
    }

    async_to_sync(channel_layer.group_send)(
        "person_events",
        {
            "type": "person_joined",
            "payload": payload,
        },
    )