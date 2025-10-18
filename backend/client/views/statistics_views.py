"""
Statistics-related views.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from django.core.paginator import Paginator
from django.db.models import Count, Q
from django.utils import timezone
from datetime import datetime, timedelta
from collections import Counter

from ..models import Person, CartProduct, Cart, Product
from ..serializers import (
    VisitCountSerializer,
    BodyTypeStatsSerializer,
    GenderStatsSerializer,
    EmotionStatsSerializer,
    AgeStatsSerializer,
)
from ..utils import get_age_category


@extend_schema(
    tags=['Statistics'],
    summary='Get visit count statistics',
    description='Возвращает статистику количества посещений с фильтрацией по времени',
    parameters=[
        OpenApiParameter(
            name='type',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Тип статистики: last_6_hours, day, week, month',
            required=True
        )
    ],
    responses={
        200: VisitCountSerializer,
        400: {'description': 'Неверный тип статистики'}
    },
    examples=[
        OpenApiExample(
            'Success Response',
            value={
                'type': 'day',
                'total_visits': 150,
                'data': [
                    {'date': '2024-01-01 00:00', 'value': 5},
                    {'date': '2024-01-01 01:00', 'value': 3}
                ]
            }
        )
    ]
)
class VisitCountStatsView(APIView):
    """GET API для получения статистики посещений."""

    def get(self, request, *args, **kwargs) -> Response:
        """Возвращает статистику посещений."""
        stats_type = request.GET.get('type')

        if not stats_type:
            return Response(
                {"error": "Параметр 'type' обязателен"},
                status=status.HTTP_400_BAD_REQUEST
            )

        now = timezone.now()

        if stats_type == 'last_6_hours':
            # Последние 6 часов с интервалом в 1 час
            start_time = now - timedelta(hours=6)
            data_points = []

            for i in range(6):
                hour_start = start_time + timedelta(hours=i)
                hour_end = hour_start + timedelta(hours=1)

                count = Person.objects.filter(
                    created_at__gte=hour_start,
                    created_at__lt=hour_end
                ).count()

                data_points.append({
                    "date": hour_start.strftime("%Y-%m-%d %H:00"),
                    "value": count
                })

            response_data = {
                "type": "last_6_hours",
                "total_visits": sum(point["value"] for point in data_points),
                "data": data_points
            }

        elif stats_type == 'day':
            # Последние 24 часа с интервалом в 1 час
            start_time = now - timedelta(hours=24)
            data_points = []

            for i in range(24):
                hour_start = start_time + timedelta(hours=i)
                hour_end = hour_start + timedelta(hours=1)

                count = Person.objects.filter(
                    created_at__gte=hour_start,
                    created_at__lt=hour_end
                ).count()

                data_points.append({
                    "date": hour_start.strftime("%Y-%m-%d %H:00"),
                    "value": count
                })

            response_data = {
                "type": "day",
                "total_visits": sum(point["value"] for point in data_points),
                "data": data_points
            }

        elif stats_type == 'week':
            # Последние 7 дней
            start_time = now - timedelta(days=7)
            data_points = []

            for i in range(7):
                day_start = start_time + timedelta(days=i)
                day_end = day_start + timedelta(days=1)

                count = Person.objects.filter(
                    created_at__gte=day_start,
                    created_at__lt=day_end
                ).count()

                data_points.append({
                    "date": day_start.strftime("%Y-%m-%d"),
                    "value": count
                })

            response_data = {
                "type": "week",
                "total_visits": sum(point["value"] for point in data_points),
                "data": data_points
            }

        elif stats_type == 'month':
            # Последние 30 дней
            start_time = now - timedelta(days=30)
            data_points = []

            for i in range(30):
                day_start = start_time + timedelta(days=i)
                day_end = day_start + timedelta(days=1)

                count = Person.objects.filter(
                    created_at__gte=day_start,
                    created_at__lt=day_end
                ).count()

                data_points.append({
                    "date": day_start.strftime("%Y-%m-%d"),
                    "value": count
                })

            response_data = {
                "type": "month",
                "total_visits": sum(point["value"] for point in data_points),
                "data": data_points
            }

        else:
            return Response(
                {"error": "Неверный тип статистики. Доступные типы: last_6_hours, day, week, month"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = VisitCountSerializer(response_data)
        return Response(serializer.data, status=status.HTTP_200_OK)


@extend_schema(
    tags=['Statistics'],
    summary='Get body type statistics',
    description='Возвращает статистику по типам телосложения',
    responses={
        200: BodyTypeStatsSerializer
    },
    examples=[
        OpenApiExample(
            'Success Response',
            value={
                'total_people': 100,
                'data': [
                    {'type': 'Normal', 'percentage': 40.0},
                    {'type': 'Athletic', 'percentage': 30.0},
                    {'type': 'Slim', 'percentage': 20.0},
                    {'type': 'Heavy', 'percentage': 10.0}
                ]
            }
        )
    ]
)
class BodyTypeStatsView(APIView):
    """GET API для получения статистики по типам телосложения."""

    def get(self, request, *args, **kwargs) -> Response:
        """Возвращает статистику по типам телосложения."""
        body_types = Person.objects.values('body_type').annotate(count=Count('body_type'))

        total = sum(item['count'] for item in body_types)

        data = []
        for item in body_types:
            percentage = (item['count'] / total * 100) if total > 0 else 0
            data.append({
                "type": item['body_type'] or "Не указан",
                "percentage": round(percentage, 2)
            })

        response_data = {
            "total_people": total,
            "data": data
        }

        serializer = BodyTypeStatsSerializer(response_data)
        return Response(serializer.data, status=status.HTTP_200_OK)


@extend_schema(
    tags=['Statistics'],
    summary='Get gender statistics',
    description='Возвращает статистику по полу',
    responses={
        200: GenderStatsSerializer
    },
    examples=[
        OpenApiExample(
            'Success Response',
            value={
                'total_people': 100,
                'data': [
                    {'type': 'Female', 'percentage': 60.0},
                    {'type': 'Male', 'percentage': 40.0}
                ]
            }
        )
    ]
)
class GenderStatsView(APIView):
    """GET API для получения статистики по полу."""

    def get(self, request, *args, **kwargs) -> Response:
        """Возвращает статистику по полу."""
        genders = Person.objects.values('gender').annotate(count=Count('gender'))

        total = sum(item['count'] for item in genders)

        data = []
        for item in genders:
            percentage = (item['count'] / total * 100) if total > 0 else 0
            data.append({
                "type": item['gender'] or "Не указан",
                "percentage": round(percentage, 2)
            })

        response_data = {
            "total_people": total,
            "data": data
        }

        serializer = GenderStatsSerializer(response_data)
        return Response(serializer.data, status=status.HTTP_200_OK)


@extend_schema(
    tags=['Statistics'],
    summary='Get emotion statistics',
    description='Возвращает статистику по эмоциям',
    responses={
        200: EmotionStatsSerializer
    },
    examples=[
        OpenApiExample(
            'Success Response',
            value={
                'total_people': 100,
                'data': [
                    {'type': 'Happy', 'value': 50},
                    {'type': 'Neutral', 'value': 30},
                    {'type': 'Sad', 'value': 20}
                ]
            }
        )
    ]
)
class EmotionStatsView(APIView):
    """GET API для получения статистики по эмоциям."""

    def get(self, request, *args, **kwargs) -> Response:
        """Возвращает статистику по эмоциям."""
        emotions = Person.objects.values('emotion').annotate(count=Count('emotion'))

        data = []
        for item in emotions:
            data.append({
                "type": item['emotion'] or "Не указана",
                "value": item['count']
            })

        response_data = {
            "total_people": sum(item['count'] for item in emotions),
            "data": data
        }

        serializer = EmotionStatsSerializer(response_data)
        return Response(serializer.data, status=status.HTTP_200_OK)


@extend_schema(
    tags=['Statistics'],
    summary='Get age statistics',
    description='Возвращает статистику по возрастным категориям',
    responses={
        200: AgeStatsSerializer
    },
    examples=[
        OpenApiExample(
            'Success Response',
            value={
                'total_people': 100,
                'data': [
                    {'type': '18-25', 'percentage': 30.0},
                    {'type': '25-35', 'percentage': 40.0},
                    {'type': '35-45', 'percentage': 20.0},
                    {'type': '45+', 'percentage': 10.0}
                ]
            }
        )
    ]
)
class AgeStatsView(APIView):
    """GET API для получения статистики по возрастным категориям."""

    def get(self, request, *args, **kwargs) -> Response:
        """Возвращает статистику по возрастным категориям."""
        # Получаем всех людей с возрастом
        people_with_age = Person.objects.exclude(age__isnull=True)

        # Группируем по возрастным категориям
        age_categories = {}
        for person in people_with_age:
            category = get_age_category(person.age)
            if category not in age_categories:
                age_categories[category] = 0
            age_categories[category] += 1

        total = sum(age_categories.values())

        data = []
        for category, count in age_categories.items():
            percentage = (count / total * 100) if total > 0 else 0
            data.append({
                "type": category,
                "percentage": round(percentage, 2)
            })

        # Сортируем по возрасту
        data.sort(key=lambda x: int(x['type'].split('-')[0]))

        response_data = {
            "total_people": total,
            "data": data
        }

        serializer = AgeStatsSerializer(response_data)
        return Response(serializer.data, status=status.HTTP_200_OK)
