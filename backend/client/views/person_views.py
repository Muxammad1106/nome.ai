"""
Person-related views.
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
    PersonVectorSerializer,
    PersonUpdateSerializer,
    PersonListSerializer,
    PersonDetailSerializer,
    PersonSummarySerializer,
    PersonOrderHistoryResponseSerializer,
)
from ..utils import get_age_category, _generate_ai_summary


@extend_schema(
    tags=['Person Management'],
    summary='Create or update person with vector',
    description='Создает или обновляет Person с векторным представлением',
    request=PersonVectorSerializer,
    responses={
        201: PersonVectorSerializer,
        400: {'description': 'Ошибка валидации данных'}
    }
)
class PersonVectorView(APIView):
    """POST API для создания Person с вектором."""

    def post(self, request, *args, **kwargs) -> Response:
        """Создает Person с вектором."""
        serializer = PersonVectorSerializer(data=request.data)
        if serializer.is_valid():
            person = serializer.save()
            response_serializer = PersonVectorSerializer(person)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=['Person Management'],
    summary='Update person',
    description='Обновляет данные Person по ID',
    request=PersonUpdateSerializer,
    responses={
        200: PersonUpdateSerializer,
        400: {'description': 'Ошибка валидации данных'},
        404: {'description': 'Person не найден'}
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
    summary='Get persons list with pagination',
    description='Возвращает список Person с пагинацией',
    parameters=[
        OpenApiParameter(
            name='page',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description='Номер страницы (по умолчанию: 1)',
            default=1
        ),
        OpenApiParameter(
            name='page_size',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description='Размер страницы (по умолчанию: 10, максимум: 100)',
            default=10
        )
    ],
    responses={
        200: PersonListSerializer(many=True),
        400: {'description': 'Ошибка валидации параметров'}
    }
)
class PersonListView(APIView):
    """GET API для получения списка Person с пагинацией."""

    def get(self, request, *args, **kwargs) -> Response:
        """Возвращает список Person с пагинацией."""
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

        if page_size > 100:
            page_size = 100
        if page_size < 1:
            page_size = 10

        persons = Person.objects.all().order_by('-created_at')
        paginator = Paginator(persons, page_size)

        try:
            page_obj = paginator.page(page)
        except:
            return Response(
                {"error": f"Страница {page} не найдена"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = PersonListSerializer(page_obj.object_list, many=True)
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


@extend_schema(
    tags=['Person Management'],
    summary='Get person details with carts and products',
    description='Возвращает детальную информацию о Person, включая все его корзины и товары',
    responses={
        200: PersonDetailSerializer,
        404: {'description': 'Person не найден'}
    }
)
class PersonDetailView(APIView):
    """GET API для получения детальной информации о Person."""

    def get(self, request, person_id, *args, **kwargs) -> Response:
        """Возвращает детальную информацию о Person с корзинами и товарами."""
        try:
            person = Person.objects.prefetch_related(
                'carts__cartproduct_set__product'
            ).get(id=person_id)
        except Person.DoesNotExist:
            return Response(
                {"error": "Person не найден"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = PersonDetailSerializer(person)
        return Response(serializer.data, status=status.HTTP_200_OK)


@extend_schema(
    tags=['Person Management'],
    summary='Get person summary with AI analysis',
    description='Возвращает краткую сводку по Person с анализом предпочтений и ИИ-резюме',
    responses={
        200: PersonSummarySerializer,
        404: {'description': 'Person не найден'},
        500: {'description': 'Ошибка при обращении к OpenAI API'}
    }
)
class PersonSummaryView(APIView):
    """GET API для получения сводки по Person с ИИ-анализом."""

    def get(self, request, person_id, *args, **kwargs) -> Response:
        """Возвращает сводку по Person с анализом предпочтений."""
        try:
            person = Person.objects.prefetch_related(
                'carts__cartproduct_set__product'
            ).get(id=person_id)
        except Person.DoesNotExist:
            return Response(
                {"error": "Person не найден"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Получаем полную историю заказов как JSON
        carts = person.carts.all().order_by('-created_at')
        total_visits = carts.count()
        last_visit = carts.first().created_at if carts.exists() else None

        # Собираем полную историю заказов в формате JSON
        order_history_data = {
            "person_id": str(person.id),
            "person_name": person.full_name or "Unknown",
            "total_orders": total_visits,
            "orders": []
        }

        # Анализируем любимые столы и блюда
        table_counts = Counter()
        dish_counts = Counter()
        total_items = 0

        for cart in carts:
            cart_products = cart.cartproduct_set.select_related('product')

            # Собираем данные о столе
            if cart.table_number:
                table_counts[cart.table_number] += 1

            # Собираем продукты в заказе
            products_in_cart = []
            for cart_product in cart_products:
                dish_name = cart_product.product.name
                dish_counts[dish_name] += 1
                total_items += 1

                products_in_cart.append({
                    "product_id": str(cart_product.product.id),
                    "product_name": cart_product.product.name,
                    "added_at": cart_product.created_at.isoformat()
                })

            # Добавляем заказ в историю
            order_history_data["orders"].append({
                "cart_id": str(cart.id),
                "cart_created_at": cart.created_at.isoformat(),
                "cart_updated_at": cart.updated_at.isoformat(),
                "table_number": cart.table_number,
                "products": products_in_cart,
                "total_products": len(products_in_cart)
            })

        # Определяем любимые блюда и стол
        favorite_table = table_counts.most_common(1)[0][0] if table_counts else None
        favorite_dishes = [
            {"dish": dish, "count": count}
            for dish, count in dish_counts.most_common(5)
        ]

        # Генерируем ИИ-сводку с полной историей заказов
        ai_summary = _generate_ai_summary(person, order_history_data)

        # Формируем ответ
        summary_data = {
            "person_id": str(person.id),
            "person_name": person.full_name or "Unknown",
            "total_visits": total_visits,
            "favorite_table": favorite_table,
            "favorite_dishes": favorite_dishes,
            "ai_summary": ai_summary,
            "last_visit": last_visit,
            "total_spent_items": total_items
        }

        serializer = PersonSummarySerializer(summary_data)
        return Response(serializer.data, status=status.HTTP_200_OK)



@extend_schema(
    tags=['Person Management'],
    summary='Get person order history',
    description='Возвращает историю заказов для указанного Person',
    responses={
        200: PersonOrderHistoryResponseSerializer,
        404: {'description': 'Person не найден'}
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
                "person_name": person.full_name,
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
            "person_name": person.full_name,
            "total_orders": len(orders_data),
            "orders": orders_data
        }

        return Response(response_data, status=status.HTTP_200_OK)
