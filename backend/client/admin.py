"""Admin registrations for client app."""
from django.contrib import admin
from . import models


@admin.register(models.Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "private_key")
    search_fields = ("name", "private_key")


@admin.register(models.Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ("id", "full_name", "phone_number", "organization")
    search_fields = ("full_name", "phone_number")
    list_filter = ("organization",)


@admin.register(models.Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "organization")
    search_fields = ("name",)
    list_filter = ("organization",)


class CartProductInline(admin.TabularInline):
    model = models.CartProduct
    extra = 1


@admin.register(models.Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "organization", "person", "created_at")
    list_filter = ("created_at", "organization")
    inlines = (CartProductInline,)


@admin.register(models.CartProduct)
class CartProductAdmin(admin.ModelAdmin):
    list_display = ("id", "organization", "cart", "product", "created_at")
    list_filter = ("created_at", "organization")
