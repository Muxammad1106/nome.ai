"""Integration tests for Person List API."""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from client.models import Person, Organization
from datetime import datetime


class PersonListAPITestCase(TestCase):
    """Test cases for Person List API."""

    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        self.organization = Organization.objects.create(
            name="Test Organization",
            private_key="TEST001"
        )
        
        # Create test persons
        for i in range(15):
            Person.objects.create(
                organization=self.organization,
                full_name=f"Person {i}",
                phone_number=f"+99890123456{i}",
                age=20 + i,
                gender="Female" if i % 2 == 0 else "Male",
                emotion="Happy" if i % 3 == 0 else "Neutral",
                body_type="Normal"
            )

    def test_get_person_list_default_pagination(self):
        """Test getting person list with default pagination."""
        url = reverse('person-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertIn('count', response.data)
        self.assertEqual(response.data['count'], 15)
        self.assertEqual(len(response.data['results']), 10)  # Default page size

    def test_get_person_list_custom_pagination(self):
        """Test getting person list with custom pagination."""
        url = reverse('person-list')
        response = self.client.get(url, {'page': 2, 'page_size': 5})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 5)
        self.assertEqual(response.data['current_page'], 2)
        self.assertEqual(response.data['page_size'], 5)

    def test_get_person_list_invalid_pagination(self):
        """Test getting person list with invalid pagination parameters."""
        url = reverse('person-list')
        response = self.client.get(url, {'page': 'invalid', 'page_size': 'invalid'})
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('page и page_size должны быть числами', str(response.data))

    def test_get_person_list_page_size_limit(self):
        """Test page size limit enforcement."""
        url = reverse('person-list')
        response = self.client.get(url, {'page_size': 150})  # Exceeds limit of 100
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['page_size'], 100)  # Should be limited to 100

    def test_get_person_list_nonexistent_page(self):
        """Test getting non-existent page."""
        url = reverse('person-list')
        response = self.client.get(url, {'page': 999})
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('Страница 999 не найдена', str(response.data))

    def test_get_person_list_ordering(self):
        """Test that persons are ordered by created_at descending."""
        url = reverse('person-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check that results are ordered by created_at descending
        results = response.data['results']
        for i in range(len(results) - 1):
            self.assertGreaterEqual(
                results[i]['created_at'], 
                results[i + 1]['created_at']
            )

    def test_get_person_list_pagination_metadata(self):
        """Test pagination metadata is correct."""
        url = reverse('person-list')
        response = self.client.get(url, {'page': 2, 'page_size': 5})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check pagination metadata
        self.assertEqual(response.data['count'], 15)
        self.assertEqual(response.data['total_pages'], 3)
        self.assertEqual(response.data['current_page'], 2)
        self.assertEqual(response.data['page_size'], 5)
        self.assertTrue(response.data['has_next'])
        self.assertTrue(response.data['has_previous'])
        self.assertEqual(response.data['next_page'], 3)
        self.assertEqual(response.data['previous_page'], 1)
