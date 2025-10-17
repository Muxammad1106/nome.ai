"""Views for core app."""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import login, logout
from django.utils import timezone
from django.contrib.auth.decorators import login_required

from .models import User
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    LoginSerializer,
    ChangePasswordSerializer
)


@api_view(['GET'])
def health_check(request):
    """Health check endpoint."""
    return Response({"status": "ok"})


class UserRegistrationView(APIView):
    """API для регистрации пользователя."""
    permission_classes = [AllowAny]

    def post(self, request):
        """Регистрация нового пользователя."""
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Автоматический вход после регистрации
            login(request, user)

            return Response({
                'message': 'Пользователь успешно зарегистрирован',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """API для входа в систему."""
    permission_classes = [AllowAny]

    def post(self, request):
        """Вход пользователя в систему."""
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']

            # Обновляем IP адрес последнего входа
            user.last_login_ip = self.get_client_ip(request)
            user.save(update_fields=['last_login_ip'])

            # Вход в систему
            login(request, user)

            return Response({
                'message': 'Успешный вход в систему',
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_client_ip(self, request):
        """Получение IP адреса клиента."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class LogoutView(APIView):
    """API для выхода из системы."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Выход пользователя из системы."""
        logout(request)
        return Response({
            'message': 'Успешный выход из системы'
        }, status=status.HTTP_200_OK)


class UserProfileView(APIView):
    """API для профиля пользователя."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Получение профиля текущего пользователя."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        """Обновление профиля пользователя."""
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Профиль успешно обновлен',
                'user': serializer.data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """API для смены пароля."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Смена пароля пользователя."""
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()

            return Response({
                'message': 'Пароль успешно изменен'
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListView(APIView):
    """API для списка пользователей (только для администраторов)."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Получение списка пользователей."""
        if not request.user.is_staff:
            return Response({
                'error': 'Недостаточно прав доступа'
            }, status=status.HTTP_403_FORBIDDEN)

        users = User.objects.all().order_by('-date_joined')
        serializer = UserSerializer(users, many=True)

        return Response({
            'count': users.count(),
            'users': serializer.data
        })
