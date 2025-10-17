"""Serializers for core app."""
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Сериализатор для модели User."""

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone_number', 'avatar', 'is_verified', 'date_joined',
            'last_login', 'is_active', 'is_staff', 'is_superuser'
        )
        read_only_fields = (
            'id', 'date_joined', 'last_login', 'is_active',
            'is_staff', 'is_superuser', 'is_verified'
        )


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Сериализатор для регистрации пользователя."""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            'username', 'email', 'first_name', 'last_name',
            'phone_number', 'password', 'password_confirm'
        )

    def validate(self, attrs):
        """Валидация паролей."""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Пароли не совпадают.")
        return attrs

    def validate_email(self, value):
        """Валидация email на уникальность."""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует.")
        return value

    def validate_username(self, value):
        """Валидация username на уникальность."""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Пользователь с таким username уже существует.")
        return value

    def create(self, validated_data):
        """Создание нового пользователя."""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')

        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user


class LoginSerializer(serializers.Serializer):
    """Сериализатор для входа в систему."""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        """Валидация данных для входа."""
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(
                request=self.context.get('request'),
                username=email,
                password=password
            )

            if not user:
                raise serializers.ValidationError('Неверный email или пароль.')

            if not user.is_active:
                raise serializers.ValidationError('Аккаунт деактивирован.')

            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Необходимо указать email и пароль.')


class ChangePasswordSerializer(serializers.Serializer):
    """Сериализатор для смены пароля."""
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(write_only=True)

    def validate(self, attrs):
        """Валидация паролей."""
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("Новые пароли не совпадают.")
        return attrs

    def validate_old_password(self, value):
        """Проверка старого пароля."""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Неверный старый пароль.")
        return value
