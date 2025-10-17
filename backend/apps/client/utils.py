"""Utility helpers for the client app."""
from __future__ import annotations

import secrets
import string


PRIVATE_KEY_ALPHABET = string.ascii_letters + string.digits
PRIVATE_KEY_LENGTH = 25


def generate_private_key() -> str:
    """Return a random alphanumeric string of length 25."""
    return "".join(secrets.choice(PRIVATE_KEY_ALPHABET) for _ in range(PRIVATE_KEY_LENGTH))

