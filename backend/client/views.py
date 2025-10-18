"""HTTP API views for the client app."""

# Removed unused import
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from django.core.paginator import Paginator
from django.db.models import Count, Q
from django.utils import timezone
from datetime import datetime, timedelta
from collections import Counter

from .models import Person, CartProduct, Cart, Product
from .serializers import (
    PersonVectorSerializer,
    PersonUpdateSerializer,
    PersonListSerializer,
    VisitCountSerializer,
    BodyTypeStatsSerializer,
    GenderStatsSerializer,
    EmotionStatsSerializer,
    AgeStatsSerializer,
    BulkCartProductCreateSerializer,
    CartProductSerializer,
    PersonOrderHistoryResponseSerializer
)
from .utils import get_age_category


@extend_schema(
    tags=['Person Management'],
    summary='Create or update person with vector data',
    description='Создает или обновляет персону с векторными данными для распознавания лиц',
    request=PersonVectorSerializer,
    responses={
        200: PersonVectorSerializer,
        400: {'description': 'Invalid data provided'}
    }
)
class PersonVectorView(APIView):
    """Accept POST payload to update a person's embedding vector and image."""
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs) -> Response:
        serializer = PersonVectorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        person: Person = serializer.save()
        person_payload = serializer.data
        person_payload["vector"] = list(person.vector)

        self._notify_person_joined(person, person_payload)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def _notify_person_joined(self, person: Person, person_payload: dict) -> None:
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


@extend_schema(
    tags=['Person Management'],
    summary='Update person information',
    description='Обновляет информацию о персоне по ID',
    request=PersonUpdateSerializer,
    responses={
        200: PersonUpdateSerializer,
        400: {'description': 'Invalid data provided'},
        404: {'description': 'Person not found'}
    }
)
class PersonUpdateView(APIView):
    """PUT API для обновления Person."""

    def put(self, request, person_id, *args, **kwargs) -> Response:
        """Обновляет данные Person по ID."""
        try:
            person = Person.objects.get(id=person_id)
        except Person.DoesNotExist:
            return Response(
                {"error": "Person не найден"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = PersonUpdateSerializer(person, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=['Person Management'],
    summary='Get list of persons',
    description='Получает список всех персон с пагинацией',
    parameters=[
        OpenApiParameter(
            name='page',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description='Номер страницы',
            default=1
        ),
        OpenApiParameter(
            name='page_size',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description='Размер страницы (максимум 100)',
            default=10
        ),
    ],
    responses={
        200: PersonListSerializer(many=True),
        400: {'description': 'Invalid pagination parameters'},
        404: {'description': 'Page not found'}
    }
)
class PersonListView(APIView):
    """GET API для получения списка Person с пагинацией."""

    def get(self, request, *args, **kwargs) -> Response:
        """Возвращает список Person с пагинацией."""
        # Получаем параметры пагинации
        page = request.GET.get('page', 1)
        page_size = request.GET.get('page_size', 10)

        try:
            page = int(page)
            page_size = int(page_size)
        except (ValueError, TypeError):
            return Response(
                {"error": "page и page_size должны быть числами"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Ограничиваем размер страницы
        if page_size > 100:
            page_size = 100
        if page_size < 1:
            page_size = 10

        # Получаем всех Person
        persons = Person.objects.all().order_by('-created_at')

        # Создаем пагинатор
        paginator = Paginator(persons, page_size)

        try:
            page_obj = paginator.page(page)
        except:
            return Response(
                {"error": f"Страница {page} не найдена"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Сериализуем данные
        serializer = PersonListSerializer(page_obj.object_list, many=True)

        # Формируем ответ с пагинацией
        response_data = {
            "count": paginator.count,
            "total_pages": paginator.num_pages,
            "current_page": page,
            "page_size": page_size,
            "has_next": page_obj.has_next(),
            "has_previous": page_obj.has_previous(),
            "next_page": page_obj.next_page_number() if page_obj.has_next() else None,
            "previous_page": page_obj.previous_page_number() if page_obj.has_previous() else None,
            "results": serializer.data
        }

        return Response(response_data, status=status.HTTP_200_OK)


# Views для статистики
@extend_schema(
    tags=['Statistics'],
    summary='Get visit count statistics',
    description='Получает статистику посещений по времени на основе created_at',
    parameters=[
        OpenApiParameter(
            name='type',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Тип периода: last_6_hours, day, week, month',
            default='day',
            enum=['last_6_hours', 'day', 'week', 'month']
        ),
    ],
    responses={
        200: VisitCountSerializer(many=True),
        400: {'description': 'Invalid period type'}
    }
)
class VisitCountStatsView(APIView):
    """API для статистики посещений по времени (на основе created_at)."""

    def get(self, request, *args, **kwargs) -> Response:
        """Возвращает статистику посещений за указанный период на основе created_at."""
        period_type = request.GET.get('type', 'day')
        now = timezone.now()

        # Определяем период в зависимости от типа
        if period_type == 'last_6_hours':
            start_time = now - timedelta(hours=6)
            group_by = 'hour'
        elif period_type == 'day':
            start_time = now - timedelta(days=1)
            group_by = 'hour'  # 24 точки по часам
        elif period_type == 'week':
            start_time = now - timedelta(days=7)
            group_by = 'day'   # 7 точек по дням
        elif period_type == 'month':
            start_time = now - timedelta(days=30)
            group_by = 'day'   # 30 точек по дням
        else:
            return Response(
                {"error": "Неверный тип периода. Доступные: last_6_hours, day, week, month"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Получаем данные о посещениях (используем created_at)
        # Если нет данных за последний период, используем все доступные данные
        visits = Person.objects.filter(
            created_at__gte=start_time,
            created_at__lte=now
        ).values('created_at')
        
        # Если нет данных за последний период, используем все данные
        if not visits.exists():
            visits = Person.objects.all().values('created_at')

        # Группируем по времени
        visit_counts = {}
        for visit in visits:
            created_time = visit['created_at']
            if created_time:
                if group_by == 'hour':
                    if period_type == 'last_6_hours':
                        key = created_time.strftime('%Y-%m-%d %H:00')
                    else:  # day - 24 часа
                        key = created_time.strftime('%H:00')
                elif group_by == 'day':
                    key = created_time.strftime('%Y-%m-%d')

                visit_counts[key] = visit_counts.get(key, 0) + 1

        # Генерируем все временные точки для заполнения пустых интервалов
        all_time_points = []

        if period_type == 'last_6_hours':
            # 6 часов назад до сейчас, каждый час
            for i in range(6):
                time_point = now - timedelta(hours=5-i)
                all_time_points.append(time_point.strftime('%Y-%m-%d %H:00'))
        elif period_type == 'day':
            # 24 часа (00:00 - 23:00)
            for hour in range(24):
                all_time_points.append(f'{hour:02d}:00')
        elif period_type == 'week':
            # 7 дней назад до сегодня
            for i in range(7):
                time_point = now - timedelta(days=6-i)
                all_time_points.append(time_point.strftime('%Y-%m-%d'))
        elif period_type == 'month':
            # 30 дней назад до сегодня
            for i in range(30):
                time_point = now - timedelta(days=29-i)
                all_time_points.append(time_point.strftime('%Y-%m-%d'))
        
        # Если нет данных за последний период, генерируем точки на основе реальных данных
        if not visits.exists():
            all_time_points = []
            if group_by == 'day':
                # Группируем по дням из реальных данных
                for visit in Person.objects.all().values('created_at'):
                    if visit['created_at']:
                        key = visit['created_at'].strftime('%Y-%m-%d')
                        if key not in all_time_points:
                            all_time_points.append(key)
                all_time_points.sort()
            elif group_by == 'hour':
                # Группируем по часам из реальных данных
                for visit in Person.objects.all().values('created_at'):
                    if visit['created_at']:
                        key = visit['created_at'].strftime('%H:00')
                        if key not in all_time_points:
                            all_time_points.append(key)
                all_time_points.sort()

        # Формируем ответ с заполнением пустых интервалов нулями
        result = []
        for time_point in all_time_points:
            value = visit_counts.get(time_point, 0)
            result.append({
                'date': time_point,
                'value': value
            })

        return Response(result, status=status.HTTP_200_OK)


@extend_schema(
    tags=['Statistics'],
    summary='Get body type statistics',
    description='Получает статистику типов телосложения в процентах',
    responses={
        200: BodyTypeStatsSerializer(many=True)
    }
)
class BodyTypeStatsView(APIView):
    """API для статистики типов телосложения."""

    def get(self, request, *args, **kwargs) -> Response:
        """Возвращает статистику типов телосложения в процентах."""
        # Получаем все типы телосложения
        body_types = Person.objects.filter(body_type__isnull=False).values_list('body_type', flat=True)

        if not body_types:
            return Response([], status=status.HTTP_200_OK)

        # Подсчитываем количество каждого типа
        type_counts = Counter(body_types)
        total = sum(type_counts.values())

        # Формируем результат с процентами
        result = []
        for body_type, count in type_counts.items():
            percentage = (count / total) * 100 if total > 0 else 0
            result.append({
                'type': body_type,
                'percentage': round(percentage, 2)
            })

        # Сортируем по убыванию процента
        result.sort(key=lambda x: x['percentage'], reverse=True)

        return Response(result, status=status.HTTP_200_OK)


@extend_schema(
    tags=['Statistics'],
    summary='Get gender statistics',
    description='Получает статистику полов в процентах',
    responses={
        200: GenderStatsSerializer(many=True)
    }
)
class GenderStatsView(APIView):
    """API для статистики полов."""

    def get(self, request, *args, **kwargs) -> Response:
        """Возвращает статистику полов в процентах."""
        # Получаем все полы
        genders = Person.objects.filter(gender__isnull=False).values_list('gender', flat=True)

        if not genders:
            return Response([], status=status.HTTP_200_OK)

        # Подсчитываем количество каждого пола
        gender_counts = Counter(genders)
        total = sum(gender_counts.values())

        # Формируем результат с процентами
        result = []
        for gender, count in gender_counts.items():
            percentage = (count / total) * 100 if total > 0 else 0
            result.append({
                'type': gender,
                'percentage': round(percentage, 2)
            })

        # Сортируем по убыванию процента
        result.sort(key=lambda x: x['percentage'], reverse=True)

        return Response(result, status=status.HTTP_200_OK)


@extend_schema(
    tags=['Statistics'],
    summary='Get emotion statistics',
    description='Получает статистику эмоций с количеством',
    responses={
        200: EmotionStatsSerializer(many=True)
    }
)
class EmotionStatsView(APIView):
    """API для статистики эмоций."""

    def get(self, request, *args, **kwargs) -> Response:
        """Возвращает статистику эмоций с количеством."""
        # Получаем все эмоции
        emotions = Person.objects.filter(emotion__isnull=False).values_list('emotion', flat=True)

        if not emotions:
            return Response([], status=status.HTTP_200_OK)

        # Подсчитываем количество каждой эмоции
        emotion_counts = Counter(emotions)

        # Формируем результат
        result = []
        for emotion, count in emotion_counts.items():
            result.append({
                'type': emotion,
                'value': count
            })

        # Сортируем по убыванию количества
        result.sort(key=lambda x: x['value'], reverse=True)

        return Response(result, status=status.HTTP_200_OK)


@extend_schema(
    tags=['Statistics'],
    summary='Get age statistics',
    description='Получает статистику возрастов в процентах по возрастным группам',
    responses={
        200: AgeStatsSerializer(many=True)
    }
)
class AgeStatsView(APIView):
    """API для статистики возрастов."""

    def get(self, request, *args, **kwargs) -> Response:
        """Возвращает статистику возрастов в процентах."""
        # Получаем все возрасты
        ages = Person.objects.filter(age__isnull=False).values_list('age', flat=True)

        if not ages:
            return Response([], status=status.HTTP_200_OK)

        # Группируем по возрастным категориям
        age_groups = {}

        for age in ages:
            category = get_age_category(age)
            age_groups[category] = age_groups.get(category, 0) + 1

        total = sum(age_groups.values())

        # Формируем результат с процентами
        result = []
        for age_group, count in age_groups.items():
            if count > 0:  # Показываем только группы с данными
                percentage = (count / total) * 100 if total > 0 else 0
                result.append({
                    'type': age_group,
                    'percentage': round(percentage, 2)
                })

        # Сортируем по возрасту
        result.sort(key=lambda x: x['type'])

        return Response(result, status=status.HTTP_200_OK)


@extend_schema(
    tags=['Cart Management'],
    summary='Bulk create cart products',
    description='Массовое создание товаров в корзинах',
    request=BulkCartProductCreateSerializer,
    responses={
        201: {'description': 'Cart products created successfully'},
        400: {'description': 'Invalid data or duplicate products'},
        500: {'description': 'Internal server error'}
    }
)
class BulkCartProductCreateView(APIView):
    """POST API для массового создания CartProduct."""

    def post(self, request, *args, **kwargs) -> Response:
        """Создает множество CartProduct объектов."""
        serializer = BulkCartProductCreateSerializer(data=request.data)

        if serializer.is_valid():
            try:
                result = serializer.save()

                created_products = result['cart_products']
                response_serializer = CartProductSerializer(created_products, many=True)

                return Response({
                    'message': f'Успешно создано {result["created_count"]} товаров в корзинах',
                    'created_count': result['created_count'],
                    'cart_products': response_serializer.data
                }, status=status.HTTP_201_CREATED)

            except Exception as e:
                return Response(
                    {'error': f'Ошибка при создании товаров в корзинах: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=['Person Management'],
    summary='Get person order history',
    description='Получает историю заказов для указанного персоны',
    responses={
        200: PersonOrderHistoryResponseSerializer,
        404: {'description': 'Person not found'}
    }
)
class PersonOrderHistoryView(APIView):
    """GET API для получения истории заказов Person."""

    def get(self, request, person_id, *args, **kwargs) -> Response:
        """Возвращает историю заказов для указанного Person."""
        try:
            person = Person.objects.get(id=person_id)
        except Person.DoesNotExist:
            return Response(
                {"error": "Person не найден"},
                status=status.HTTP_404_NOT_FOUND
            )

        carts = Cart.objects.filter(person=person).order_by('-created_at')

        if not carts.exists():
            return Response({
                "person_id": str(person.id),
                "person_name": person.full_name or person.name,
                "total_orders": 0,
                "orders": []
            }, status=status.HTTP_200_OK)

        orders_data = []

        for cart in carts:
            cart_products = CartProduct.objects.filter(cart=cart).select_related('product')

            products_in_cart = []
            for cart_product in cart_products:
                products_in_cart.append({
                    "product_id": str(cart_product.product.id),
                    "product_name": cart_product.product.name,
                    "added_at": cart_product.created_at.isoformat()
                })

            orders_data.append({
                "cart_id": str(cart.id),
                "cart_created_at": cart.created_at,
                "cart_updated_at": cart.updated_at,
                "products": products_in_cart,
                "total_products": len(products_in_cart)
            })

        response_data = {
            "person_id": str(person.id),
            "person_name": person.full_name or person.name,
            "total_orders": len(orders_data),
            "orders": orders_data
        }

        return Response(response_data, status=status.HTTP_200_OK)
