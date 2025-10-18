"""Utility helpers for the client app."""
from __future__ import annotations

import secrets
import string
import openai
import os
from collections import Counter


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


def _generate_ai_summary(person, order_history_data):
    """Generate AI summary using OpenAI API with English prompts and responses."""
    try:
        # Get API key from environment variables
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            return "AI analysis unavailable: OPENAI_API_KEY not configured"

        # Setup OpenAI client
        client = openai.OpenAI(api_key=api_key)

        # Analyze order history to determine favorite dishes and tables
        favorite_dishes = []
        favorite_tables = []
        total_items = 0
        total_visits = len(order_history_data.get('orders', []))

        # Count favorite dishes and tables from all orders
        dish_counts = Counter()
        table_counts = Counter()

        for order in order_history_data.get('orders', []):
            # Count table preferences
            if order.get('table_number'):
                table_counts[order['table_number']] += 1

            # Count dish preferences from products in this order
            for product in order.get('products', []):
                dish_name = product.get('product_name', '')
                if dish_name:
                    dish_counts[dish_name] += 1
                    total_items += 1

        # Get top 3 favorite dishes
        favorite_dishes = [{"dish": dish, "count": count} for dish, count in dish_counts.most_common(3)]

        # Get most frequent table
        favorite_table = table_counts.most_common(1)[0][0] if table_counts else None

        # Format the prompt in English
        prompt = f"""
        Analyze restaurant customer data and create a brief personalized summary:

        Customer: {person.full_name or 'Unknown'}
        Age: {person.age or 'Not specified'}
        Gender: {person.gender or 'Not specified'}
        Emotion: {person.emotion or 'Not specified'}
        Body Type: {person.body_type or 'Not specified'}

        Visit Statistics:
        - Total visits: {total_visits}
        - Favorite table: {favorite_table or 'Not determined'}
        - Favorite dishes: {favorite_dishes}
        - Total ordered items: {total_items}

        Complete order history as JSON:
        {order_history_data}

        Create a brief (2-3 sentences) personalized summary in English
        that will help restaurant staff better serve this customer.
        Focus on their dining patterns, preferences, and behavioral insights.
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a restaurant assistant that analyzes customer data and provides insights for better service."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        return f"Error generating AI summary: {str(e)}"

