"""
Cart-related views.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from django.core.paginator import Paginator

from ..models import Person, CartProduct, Cart, Product
from ..serializers import (
    CartCreateSerializer,
    CartSerializer,
    CartProductCreateSerializer,
    CartProductSerializer,
    BulkCartProductCreateSerializer,
)


@extend_schema(
    tags=['Cart Management'],
    summary='Create a new cart',
    description='Создает новую корзину для указанного Person в организации',
    request=CartCreateSerializer,
    responses={
        201: CartSerializer,
        400: {'description': 'Ошибка валидации данных'},
        404: {'description': 'Person или Organization не найдены'}
    }
)
class CartCreateView(APIView):
    """POST API для создания корзины."""

    def post(self, request, *args, **kwargs) -> Response:
        """Создает новую корзину."""
        serializer = CartCreateSerializer(data=request.data)

        if serializer.is_valid():
            try:
                cart = serializer.save()
                response_serializer = CartSerializer(cart)
                return Response(response_serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response(
                    {'error': f'Ошибка при создании корзины: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=['Cart Product Management'],
    summary='Create a cart product',
    description='Создает связь между корзиной и продуктом',
    request=CartProductCreateSerializer,
    responses={
        201: CartProductSerializer,
        400: {'description': 'Ошибка валидации данных'},
        404: {'description': 'Cart или Product не найдены'},
        409: {'description': 'CartProduct уже существует'}
    }
)
class CartProductCreateView(APIView):
    """POST API для создания CartProduct."""

    def post(self, request, *args, **kwargs) -> Response:
        """Создает связь между корзиной и продуктом."""
        serializer = CartProductCreateSerializer(data=request.data)

        if serializer.is_valid():
            try:
                # Проверяем, что CartProduct с такой комбинацией не существует
                cart = serializer.validated_data['cart']
                product = serializer.validated_data['product']

                if CartProduct.objects.filter(cart=cart, product=product).exists():
                    return Response(
                        {'error': 'CartProduct с такой комбинацией cart и product уже существует'},
                        status=status.HTTP_409_CONFLICT
                    )

                cart_product = serializer.save()
                response_serializer = CartProductSerializer(cart_product)
                return Response(response_serializer.data, status=status.HTTP_201_CREATED)

            except Exception as e:
                return Response(
                    {'error': f'Ошибка при создании CartProduct: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    tags=['Cart Product Management'],
    summary='Bulk create cart products',
    description='Массовое создание CartProduct объектов',
    request=BulkCartProductCreateSerializer,
    responses={
        201: CartProductSerializer(many=True),
        400: {'description': 'Ошибка валидации данных'},
        500: {'description': 'Ошибка при создании товаров'}
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
