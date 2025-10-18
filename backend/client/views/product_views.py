"""
Product-related views.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from django.core.paginator import Paginator

from ..models import Product
from ..serializers import ProductSerializer


@extend_schema(
    tags=['Product Management'],
    summary='Get products list with pagination',
    description='Возвращает список продуктов с пагинацией',
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
        ),
        OpenApiParameter(
            name='organization',
            type=OpenApiTypes.UUID,
            location=OpenApiParameter.QUERY,
            description='Фильтр по организации (UUID)',
            required=False
        ),
        OpenApiParameter(
            name='search',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Поиск по названию продукта',
            required=False
        )
    ],
    responses={
        200: ProductSerializer(many=True),
        400: {'description': 'Ошибка валидации параметров'}
    }
)
class ProductListView(APIView):
    """GET API для получения списка продуктов с пагинацией."""

    def get(self, request, *args, **kwargs) -> Response:
        """Возвращает список продуктов с пагинацией."""
        page = request.GET.get('page', 1)
        page_size = request.GET.get('page_size', 10)
        organization_id = request.GET.get('organization')
        search_query = request.GET.get('search')

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

        # Базовый запрос
        products = Product.objects.all()

        # Фильтр по организации
        if organization_id:
            try:
                products = products.filter(organization_id=organization_id)
            except ValueError:
                return Response(
                    {"error": "Неверный формат UUID для organization"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Поиск по названию
        if search_query:
            products = products.filter(name__icontains=search_query)

        # Сортировка по дате создания
        products = products.order_by('-created_at')

        # Пагинация
        paginator = Paginator(products, page_size)

        try:
            page_obj = paginator.page(page)
        except:
            return Response(
                {"error": f"Страница {page} не найдена"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ProductSerializer(page_obj.object_list, many=True)
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
