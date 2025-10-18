"""URL patterns for core app."""
from django.urls import path
from . import views

urlpatterns = [
    path("", views.health_check, name="health-check"),
    path("auth/login/", views.LoginView.as_view(), name="user-login"),
    path("auth/logout/", views.LogoutView.as_view(), name="user-logout"),
    path("auth/profile/", views.UserProfileView.as_view(), name="user-profile"),
    path("auth/change-password/", views.ChangePasswordView.as_view(), name="change-password"),
    path("auth/users/", views.UserListView.as_view(), name="user-list"),
]
