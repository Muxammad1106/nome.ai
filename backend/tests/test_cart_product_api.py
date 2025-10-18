"""Integration tests for Cart Product APIs."""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from client.models import Person, Organization, Product, Cart, CartProduct


class CartProductAPITestCase(TestCase):
    """Test cases for Cart Product APIs."""

    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        self.organization = Organization.objects.create(
            name="Test Organization",
            private_key="TEST001"
        )
        
        self.person = Person.objects.create(
            organization=self.organization,
            full_name="Test Person",
            phone_number="+998901234567",
            age=25,
            gender="Female",
            emotion="Happy",
            body_type="Normal"
        )
        
        self.cart = Cart.objects.create(
            organization=self.organization,
            person=self.person
        )
        
        self.products = [
            Product.objects.create(
                organization=self.organization,
                name=f"Product {i}"
            ) for i in range(5)
        ]

    def test_bulk_cart_product_create_success(self):
        """Test successful bulk cart product creation."""
        url = reverse('bulk-cart-product-create')
        data = {
            'cart_products': [
                {
                    'organization': self.organization.id,
                    'cart': self.cart.id,
                    'product': self.products[0].id
                },
                {
                    'organization': self.organization.id,
                    'cart': self.cart.id,
                    'product': self.products[1].id
                }
            ]
        }

        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', response.data)
        self.assertIn('created_count', response.data)
        self.assertIn('cart_products', response.data)
        self.assertEqual(response.data['created_count'], 2)

    def test_bulk_cart_product_create_duplicate(self):
        """Test bulk cart product creation with duplicates."""
        url = reverse('bulk-cart-product-create')
        data = {
            'cart_products': [
                {
                    'organization': self.organization.id,
                    'cart': self.cart.id,
                    'product': self.products[0].id
                },
                {
                    'organization': self.organization.id,
                    'cart': self.cart.id,
                    'product': self.products[0].id  # Duplicate
                }
            ]
        }

        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Дублирующаяся комбинация', str(response.data))

    def test_bulk_cart_product_create_empty_list(self):
        """Test bulk cart product creation with empty list."""
        url = reverse('bulk-cart-product-create')
        data = {'cart_products': []}

        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_bulk_cart_product_create_invalid_data(self):
        """Test bulk cart product creation with invalid data."""
        url = reverse('bulk-cart-product-create')
        data = {
            'cart_products': [
                {
                    'organization': 'invalid-uuid',
                    'cart': self.cart.id,
                    'product': self.products[0].id
                }
            ]
        }

        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_bulk_cart_product_create_max_limit(self):
        """Test bulk cart product creation with max limit exceeded."""
        url = reverse('bulk-cart-product-create')
        
        # Create 101 cart products (exceeds max limit of 100)
        cart_products = []
        for i in range(101):
            cart_products.append({
                'organization': self.organization.id,
                'cart': self.cart.id,
                'product': self.products[0].id
            })
        
        data = {'cart_products': cart_products}

        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
