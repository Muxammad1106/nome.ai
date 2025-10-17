"""URL patterns for core app."""
from django.urls import path
from . import views

urlpatterns = [
    path("", views.health_check, name="health-check"),
    path("auth/login/", views.LoginView.as_view(), name="user-login"),
]
