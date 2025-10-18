"""Simple test to verify test setup."""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status


class SimpleTestCase(TestCase):
    """Simple test case to verify test setup."""

    def setUp(self):
        """Set up test data."""
        self.client = APIClient()

    def test_health_check(self):
        """Test health check endpoint."""
        url = reverse('health-check')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'ok')

    def test_person_list_empty(self):
        """Test person list when empty."""
        url = reverse('person-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 0)
        self.assertEqual(len(response.data['results']), 0)
