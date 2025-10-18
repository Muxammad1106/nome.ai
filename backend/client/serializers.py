"""Serializers for client app APIs."""
from __future__ import annotations

import json
from typing import Any

from django.conf import settings
from rest_framework import serializers
from pgvector.django import CosineDistance

from .models import Person, Organization, CartProduct, Cart, Product


class PersonVectorSerializer(serializers.ModelSerializer):
    vector = serializers.JSONField(required=False, allow_null=True)
    age = serializers.IntegerField(required=False, allow_null=True)
    gender = serializers.CharField(max_length=255, required=False, allow_null=True)
    emotion = serializers.CharField(max_length=255, required=False, allow_null=True)
    body_type = serializers.CharField(max_length=255, required=False, allow_null=True)
    entry_time = serializers.DateTimeField(required=False, allow_null=True)
    exit_time = serializers.DateTimeField(required=False, allow_null=True)

    class Meta:
        model = Person
        fields = ("id", "vector", "image", "age", "gender", "emotion", "body_type", "entry_time", "exit_time")
        read_only_fields = ("id",)

    def validate_vector(self, v: Any):
        if v in (None, "", []):
            return None

        if isinstance(v, str):
            try:
                v = json.loads(v)
            except json.JSONDecodeError as exc:  # pragma: no cover - defensive branch
                raise serializers.ValidationError("Vector must be valid JSON.") from exc

        try:
            vector = [float(x) for x in v]
        except (TypeError, ValueError):
            raise serializers.ValidationError("Vector must be a list of floats.")

        dimensions = Person._meta.get_field("vector").dimensions
        if len(vector) != dimensions:
            raise serializers.ValidationError(f"Vector must contain {dimensions} values.")

        return vector

    def validate_age(self, age):
        """Валидация возраста с проверкой на разумные значения."""
        if age is not None:
            if not isinstance(age, int):
                try:
                    age = int(age)
                except (ValueError, TypeError):
                    raise serializers.ValidationError("Возраст должен быть числом.")

            if age < 0:
                raise serializers.ValidationError("Возраст не может быть отрицательным.")

            if age > 100:
                raise serializers.ValidationError("Возраст не может быть больше 120 лет.")

        return age

    @staticmethod
    def _distance_threshold() -> float:
        similarity = getattr(settings, "PERSON_VECTOR_DUPLICATE_SIMILARITY_THRESHOLD", 0.95)
        try:
            similarity = float(similarity)
        except (TypeError, ValueError):
            similarity = 0.95

        similarity = min(max(similarity, 0.0), 1.0)
        return 1.0 - similarity

    def create(self, validated_data: dict) -> Person:
        organization = Organization.objects.all().first()
        if not organization:
            organization = Organization.objects.create(name="Default Organization")

        vector = validated_data.get("vector")
        if vector:
            # Only use vector similarity for PostgreSQL with pgvector
            from django.db import connection
            if connection.vendor == 'postgresql':
                duplicate = (
                    Person.objects.filter(organization=organization, vector__isnull=False)
                    .annotate(distance=CosineDistance("vector", vector))
                    .order_by("distance")
                    .first()
                )

                if duplicate and duplicate.distance is not None:
                    distance = float(duplicate.distance)
                    if distance <= self._distance_threshold():
                        self.instance = duplicate
                        return duplicate

        return Person.objects.create(
            organization=organization,
            **validated_data
        )


class PersonUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления Person через PUT запрос."""

    class Meta:
        model = Person
        fields = (
            "id",
            "full_name",
            "phone_number",
            "age",
            "gender",
            "emotion",
            "body_type",
            "entry_time",
            "exit_time",
        )
        read_only_fields = ("id",)

    def validate_age(self, age):
        """Валидация возраста с проверкой на разумные значения."""
        if age is not None:
            if not isinstance(age, int):
                try:
                    age = int(age)
                except (ValueError, TypeError):
                    raise serializers.ValidationError("Возраст должен быть числом.")

            if age < 0:
                raise serializers.ValidationError("Возраст не может быть отрицательным.")

            if age > 120:
                raise serializers.ValidationError("Возраст не может быть больше 120 лет.")

        return age

    def validate_gender(self, gender):
        """Валидация пола."""
        if gender is not None:
            valid_genders = ['Male', 'Female', 'Other']
            if gender not in valid_genders:
                raise serializers.ValidationError(f"Пол должен быть одним из: {', '.join(valid_genders)}")
        return gender

    def update(self, instance, validated_data):
        """Обновляет экземпляр Person."""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class PersonListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка Person."""

    class Meta:
        model = Person
        fields = (
            "id",
            "image",
            "full_name",
            "phone_number",
            "age",
            "gender",
            "emotion",
            "body_type",
            "entry_time",
            "exit_time",
            "created_at",
            "updated_at"
        )
        read_only_fields = ("id", "created_at", "updated_at")


# Сериализаторы для статистики
class VisitCountDataSerializer(serializers.Serializer):
    """Сериализатор для данных статистики посещений."""
    date = serializers.CharField()
    value = serializers.IntegerField()


class VisitCountSerializer(serializers.Serializer):
    """Сериализатор для статистики посещений."""
    type = serializers.CharField()
    total_visits = serializers.IntegerField()
    data = VisitCountDataSerializer(many=True)


class BodyTypeStatsDataSerializer(serializers.Serializer):
    """Сериализатор для данных статистики типов телосложения."""
    type = serializers.CharField()
    percentage = serializers.FloatField()


class BodyTypeStatsSerializer(serializers.Serializer):
    """Сериализатор для статистики типов телосложения."""
    total_people = serializers.IntegerField()
    data = BodyTypeStatsDataSerializer(many=True)


class GenderStatsDataSerializer(serializers.Serializer):
    """Сериализатор для данных статистики полов."""
    type = serializers.CharField()
    percentage = serializers.FloatField()


class GenderStatsSerializer(serializers.Serializer):
    """Сериализатор для статистики полов."""
    total_people = serializers.IntegerField()
    data = GenderStatsDataSerializer(many=True)


class EmotionStatsDataSerializer(serializers.Serializer):
    """Сериализатор для данных статистики эмоций."""
    type = serializers.CharField()
    value = serializers.IntegerField()


class EmotionStatsSerializer(serializers.Serializer):
    """Сериализатор для статистики эмоций."""
    total_people = serializers.IntegerField()
    data = EmotionStatsDataSerializer(many=True)


class AgeStatsDataSerializer(serializers.Serializer):
    """Сериализатор для данных статистики возрастов."""
    type = serializers.CharField()
    percentage = serializers.FloatField()


class AgeStatsSerializer(serializers.Serializer):
    """Сериализатор для статистики возрастов."""
    total_people = serializers.IntegerField()
    data = AgeStatsDataSerializer(many=True)


# Сериализаторы для CartProduct
class CartProductSerializer(serializers.ModelSerializer):
    """Сериализатор для CartProduct."""

    class Meta:
        model = CartProduct
        fields = (
            "id",
            "organization",
            "cart",
            "product",
            "created_at",
            "updated_at"
        )
        read_only_fields = ("id", "created_at", "updated_at")


class CartProductCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания CartProduct."""

    class Meta:
        model = CartProduct
        fields = (
            "organization",
            "cart",
            "product"
        )


class BulkCartProductCreateSerializer(serializers.Serializer):
    """Сериализатор для массового создания CartProduct."""

    cart_products = serializers.ListField(
        child=CartProductCreateSerializer(),
        min_length=1,
        max_length=100
    )

    def validate(self, data):
        """Валидация данных для массового создания."""
        cart_products = data.get('cart_products', [])

        # Проверяем, что все cart_products имеют уникальные комбинации cart + product
        seen_combinations = set()
        for item in cart_products:
            cart_id = item.get('cart')
            product_id = item.get('product')
            combination = (cart_id, product_id)

            if combination in seen_combinations:
                raise serializers.ValidationError(
                    f"Дублирующаяся комбинация cart={cart_id} и product={product_id}"
                )
            seen_combinations.add(combination)

        return data

    def create(self, validated_data):
        """Создает множество CartProduct объектов."""
        cart_products_data = validated_data.get('cart_products', [])

        # Создаем объекты CartProduct
        cart_products = []
        for item_data in cart_products_data:
            cart_product = CartProduct.objects.create(**item_data)
            cart_products.append(cart_product)

        return {
            'created_count': len(cart_products),
            'cart_products': cart_products
        }


# Сериализаторы для истории заказов
class PersonOrderHistorySerializer(serializers.Serializer):
    """Сериализатор для истории заказов Person."""

    cart_id = serializers.UUIDField()
    cart_created_at = serializers.DateTimeField()
    cart_updated_at = serializers.DateTimeField()
    table_number = serializers.IntegerField()
    products = serializers.ListField(
        child=serializers.DictField(),
        help_text="Список товаров в заказе"
    )
    total_products = serializers.IntegerField(help_text="Общее количество товаров в заказе")


class PersonOrderHistoryResponseSerializer(serializers.Serializer):
    """Сериализатор для ответа истории заказов Person."""

    person_id = serializers.UUIDField()
    person_name = serializers.CharField()
    total_orders = serializers.IntegerField()
    orders = PersonOrderHistorySerializer(many=True)


class CartCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания корзины."""

    class Meta:
        model = Cart
        fields = (
            "organization",
            "person",
            "table_number"
        )

    def validate(self, data):
        """Валидация данных для создания корзины."""
        organization = data.get('organization')
        person = data.get('person')

        # Проверяем, что Person принадлежит указанной организации
        if person and organization:
            if person.organization != organization:
                raise serializers.ValidationError(
                    "Person должен принадлежать указанной организации"
                )

        return data


class CartSerializer(serializers.ModelSerializer):
    """Сериализатор для корзины."""

    class Meta:
        model = Cart
        fields = (
            "id",
            "organization",
            "person",
            "table_number",
            "created_at",
            "updated_at"
        )
        read_only_fields = ("id", "created_at", "updated_at")


class ProductSerializer(serializers.ModelSerializer):
    """Сериализатор для продукта."""

    class Meta:
        model = Product
        fields = (
            "id",
            "organization",
            "name",
            "created_at",
            "updated_at"
        )
        read_only_fields = ("id", "created_at", "updated_at")


class CartProductDetailSerializer(serializers.ModelSerializer):
    """Детальный сериализатор для CartProduct с информацией о продукте."""

    product_name = serializers.CharField(source='product.name', read_only=True)
    product_id = serializers.UUIDField(source='product.id', read_only=True)

    class Meta:
        model = CartProduct
        fields = (
            "id",
            "product_id",
            "product_name",
            "created_at",
            "updated_at"
        )
        read_only_fields = ("id", "created_at", "updated_at")


class CartDetailSerializer(serializers.ModelSerializer):
    """Детальный сериализатор для Cart с товарами."""

    cart_products = CartProductDetailSerializer(source='cartproduct_set', many=True, read_only=True)
    total_products = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = (
            "id",
            "table_number",
            "cart_products",
            "total_products",
            "created_at",
            "updated_at"
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def get_total_products(self, obj):
        """Возвращает общее количество товаров в корзине."""
        return obj.cartproduct_set.count()


class PersonDetailSerializer(serializers.ModelSerializer):
    """Детальный сериализатор для Person со всеми корзинами и товарами."""

    carts = CartDetailSerializer(many=True, read_only=True)
    total_carts = serializers.SerializerMethodField()
    total_products_in_carts = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = (
            "id",
            "organization",
            "full_name",
            "phone_number",
            "age",
            "gender",
            "emotion",
            "body_type",
            "entry_time",
            "exit_time",
            "image",
            "carts",
            "total_carts",
            "total_products_in_carts",
            "created_at",
            "updated_at"
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def get_total_carts(self, obj):
        """Возвращает общее количество корзин у Person."""
        return obj.carts.count()

    def get_total_products_in_carts(self, obj):
        """Возвращает общее количество товаров во всех корзинах Person."""
        total = 0
        for cart in obj.carts.all():
            total += cart.cartproduct_set.count()
        return total


class PersonSummarySerializer(serializers.Serializer):
    """Сериализатор для сводки по Person."""

    person_id = serializers.UUIDField()
    person_name = serializers.CharField()
    total_visits = serializers.IntegerField()
    favorite_table = serializers.IntegerField(allow_null=True)
    favorite_dishes = serializers.ListField(
        child=serializers.DictField(),
        help_text="Список любимых блюд с количеством заказов"
    )
    ai_summary = serializers.CharField(help_text="Краткая сводка от ИИ")
    last_visit = serializers.DateTimeField(allow_null=True)
    total_spent_items = serializers.IntegerField(help_text="Общее количество заказанных блюд")
