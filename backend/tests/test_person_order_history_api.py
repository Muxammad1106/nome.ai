"""Integration tests for Person Order History API."""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from client.models import Person, Organization, Product, Cart, CartProduct


class PersonOrderHistoryAPITestCase(TestCase):
    """Test cases for Person Order History API."""

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
        
        self.products = [
            Product.objects.create(
                organization=self.organization,
                name=f"Product {i}"
            ) for i in range(3)
        ]

    def test_get_person_order_history_success(self):
        """Test successful person order history retrieval."""
        # Create carts and cart products
        cart1 = Cart.objects.create(
            organization=self.organization,
            person=self.person
        )
        cart2 = Cart.objects.create(
            organization=self.organization,
            person=self.person
        )
        
        # Add products to carts
        CartProduct.objects.create(
            organization=self.organization,
            cart=cart1,
            product=self.products[0]
        )
        CartProduct.objects.create(
            organization=self.organization,
            cart=cart1,
            product=self.products[1]
        )
        CartProduct.objects.create(
            organization=self.organization,
            cart=cart2,
            product=self.products[2]
        )
        
        url = reverse('person-order-history', kwargs={'person_id': self.person.id})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('person_id', response.data)
        self.assertIn('person_name', response.data)
        self.assertIn('total_orders', response.data)
        self.assertIn('orders', response.data)
        
        self.assertEqual(response.data['total_orders'], 2)
        self.assertEqual(len(response.data['orders']), 2)

    def test_get_person_order_history_no_orders(self):
        """Test person order history with no orders."""
        url = reverse('person-order-history', kwargs={'person_id': self.person.id})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_orders'], 0)
        self.assertEqual(response.data['orders'], [])

    def test_get_person_order_history_nonexistent_person(self):
        """Test person order history with non-existent person."""
        fake_uuid = '00000000-0000-0000-0000-000000000000'
        url = reverse('person-order-history', kwargs={'person_id': fake_uuid})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('Person не найден', str(response.data))

    def test_get_person_order_history_with_products(self):
        """Test person order history with detailed product information."""
        cart = Cart.objects.create(
            organization=self.organization,
            person=self.person
        )
        
        # Add multiple products to cart
        for product in self.products:
            CartProduct.objects.create(
                organization=self.organization,
                cart=cart,
                product=product
            )
        
        url = reverse('person-order-history', kwargs={'person_id': self.person.id})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        order = response.data['orders'][0]
        self.assertIn('cart_id', order)
        self.assertIn('cart_created_at', order)
        self.assertIn('cart_updated_at', order)
        self.assertIn('products', order)
        self.assertIn('total_products', order)
        
        self.assertEqual(order['total_products'], 3)
        self.assertEqual(len(order['products']), 3)
        
        # Check product details
        for product in order['products']:
            self.assertIn('product_id', product)
            self.assertIn('product_name', product)
            self.assertIn('added_at', product)
