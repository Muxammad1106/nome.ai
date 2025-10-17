"""URL configuration for the nome.ai Django backend."""
from django.contrib import admin
from django.urls import path

from apps.core import views as core_views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", core_views.health_check, name="health-check"),
]
