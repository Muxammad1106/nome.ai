"""Utility helpers for the client app."""
from __future__ import annotations

import secrets
import string


PRIVATE_KEY_ALPHABET = string.ascii_letters + string.digits
PRIVATE_KEY_LENGTH = 25


def generate_private_key() -> str:
    """Return a random alphanumeric string of length 25."""
    return "".join(secrets.choice(PRIVATE_KEY_ALPHABET) for _ in range(PRIVATE_KEY_LENGTH))


def get_age_category(age: int) -> str:
    """Определяет возрастную категорию по возрасту."""
    if age <= 10:
        return "0-10"      # ребенок
    elif age <= 18:
        return "10-18"    # подросток
    elif age <= 25:
        return "18-25"    # совершеннолетний
    elif age <= 35:
        return "25-35"    # молодой взрослый
    elif age <= 45:
        return "35-45"    # взрослый
    elif age <= 55:
        return "45-55"    # зрелый
    elif age <= 65:
        return "55-65"    # пожилой
    else:
        return "65+"       # старший


def get_age_category_name(age: int) -> str:
    """Возвращает название возрастной категории."""
    if age <= 10:
        return "ребенок"
    elif age <= 18:
        return "подросток"
    elif age <= 25:
        return "совершеннолетний"
    elif age <= 35:
        return "молодой взрослый"
    elif age <= 45:
        return "взрослый"
    elif age <= 55:
        return "зрелый"
    elif age <= 65:
        return "пожилой"
    else:
        return "старший"

