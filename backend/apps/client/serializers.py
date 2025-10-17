"""Serializers for client app APIs."""
from __future__ import annotations

import json

from rest_framework import serializers

from .models import Person


class PersonVectorSerializer(serializers.ModelSerializer):
    """Serializer to update a person's embedding vector and image."""

    vector = serializers.JSONField()
    image = serializers.ImageField()

    class Meta:
        model = Person
        fields = ("id", "name", "vector", "image")
        read_only_fields = ("id", "name")

    def validate_vector(self, value):
        if isinstance(value, str):
            try:
                value = json.loads(value)
            except json.JSONDecodeError as exc:
                raise serializers.ValidationError("Vector must be valid JSON array") from exc

        if not isinstance(value, (list, tuple)):
            raise serializers.ValidationError("Vector must be an array")

        if not value:
            raise serializers.ValidationError("Vector must not be empty")

        try:
            return [float(item) for item in value]
        except (TypeError, ValueError) as exc:
            raise serializers.ValidationError("Vector must contain only numbers") from exc

    def update(self, instance: Person, validated_data: dict) -> Person:
        instance.vector = validated_data["vector"]
        instance.image = validated_data["image"]
        instance.save(update_fields=["vector", "image"])
        return instance
