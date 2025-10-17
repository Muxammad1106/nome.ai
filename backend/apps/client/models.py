"""Data models for people, organizations, and products."""
from __future__ import annotations

from django.db import models
from apps.core.models import BaseModel
from .utils import generate_private_key
from pgvector.django import VectorField


class Organization(BaseModel):
    """Represents an organization."""

    name = models.CharField(max_length=255, unique=True)
    private_key = models.CharField(
        max_length=25,
        unique=True,
        default=generate_private_key,
        editable=False,
    )

    def __str__(self) -> str:
        return self.name


class Person(BaseModel):
    """Represents a person with an embedding vector."""

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="people")
    name = models.CharField(max_length=255)
    vector = VectorField(dimensions=128)

    def __str__(self) -> str:
        return self.name


class Product(BaseModel):
    """Sellable product."""

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="products")
    name = models.CharField(max_length=255, unique=True)

    def __str__(self) -> str:
        return self.name


class Cart(BaseModel):
    """Cart belonging to a person within an organization."""

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="carts")
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name="carts")
    products = models.ManyToManyField(Product, through="CartProduct", related_name="carts")

    def __str__(self) -> str:
        return f"Cart #{self.pk} ({self.person})"


class CartProduct(BaseModel):
    """Through table linking carts and products."""

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="cart_products")
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("cart", "product")

    def __str__(self) -> str:
        return f"{self.cart} -> {self.product}"
