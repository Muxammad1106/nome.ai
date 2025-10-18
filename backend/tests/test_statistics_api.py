"""Integration tests for Statistics APIs."""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from client.models import Person, Organization
from django.utils import timezone
from datetime import datetime, timedelta


class StatisticsAPITestCase(TestCase):
    """Test cases for Statistics APIs."""

    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        self.organization = Organization.objects.create(
            name="Test Organization",
            private_key="TEST001"
        )

        # Create test persons with different attributes
        self.persons_data = [
            {'age': 25, 'gender': 'Female', 'emotion': 'Happy', 'body_type': 'Normal'},
            {'age': 30, 'gender': 'Male', 'emotion': 'Neutral', 'body_type': 'Athletic'},
            {'age': 35, 'gender': 'Female', 'emotion': 'Sad', 'body_type': 'Slim'},
            {'age': 40, 'gender': 'Male', 'emotion': 'Angry', 'body_type': 'Heavy'},
            {'age': 45, 'gender': 'Female', 'emotion': 'Happy', 'body_type': 'Normal'},
        ]

        # Create persons with specific created_at dates for testing
        base_date = timezone.now() - timedelta(days=10)
        for i, person_data in enumerate(self.persons_data):
            Person.objects.create(
                organization=self.organization,
                full_name=f"Person {i}",
                phone_number=f"+99890123456{i}",
                created_at=base_date + timedelta(days=i),
                **person_data
            )

    def test_visit_count_stats_week(self):
        """Test visit count statistics for week period."""
        url = reverse('visit-count-stats')
        response = self.client.get(url, {'type': 'week'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, dict)
        self.assertIn('type', response.data)
        self.assertIn('total_visits', response.data)
        self.assertIn('data', response.data)

        # Should have 7 days of data
        self.assertEqual(len(response.data['data']), 7)

        # Each entry should have date and value
        for entry in response.data['data']:
            self.assertIn('date', entry)
            self.assertIn('value', entry)
            self.assertIsInstance(entry['value'], int)

    def test_visit_count_stats_day(self):
        """Test visit count statistics for day period."""
        url = reverse('visit-count-stats')
        response = self.client.get(url, {'type': 'day'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, dict)
        self.assertIn('type', response.data)
        self.assertIn('total_visits', response.data)
        self.assertIn('data', response.data)
        
        # Should have 24 hours of data
        self.assertEqual(len(response.data['data']), 24)

    def test_visit_count_stats_invalid_type(self):
        """Test visit count statistics with invalid type."""
        url = reverse('visit-count-stats')
        response = self.client.get(url, {'type': 'invalid'})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Неверный тип статистики', str(response.data))

    def test_body_type_stats(self):
        """Test body type statistics."""
        url = reverse('body-type-stats')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, dict)
        self.assertIn('total_people', response.data)
        self.assertIn('data', response.data)

        # Check that percentages sum to 100
        total_percentage = sum(entry['percentage'] for entry in response.data['data'])
        self.assertAlmostEqual(total_percentage, 100.0, places=1)

        # Check data structure
        for entry in response.data['data']:
            self.assertIn('type', entry)
            self.assertIn('percentage', entry)
            self.assertIsInstance(entry['percentage'], (int, float))

    def test_gender_stats(self):
        """Test gender statistics."""
        url = reverse('gender-stats')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, dict)
        self.assertIn('total_people', response.data)
        self.assertIn('data', response.data)

        # Check that percentages sum to 100
        total_percentage = sum(entry['percentage'] for entry in response.data['data'])
        self.assertAlmostEqual(total_percentage, 100.0, places=1)

    def test_emotion_stats(self):
        """Test emotion statistics."""
        url = reverse('emotion-stats')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, dict)
        self.assertIn('total_people', response.data)
        self.assertIn('data', response.data)

        # Check data structure
        for entry in response.data['data']:
            self.assertIn('type', entry)
            self.assertIn('value', entry)
            self.assertIsInstance(entry['value'], int)

    def test_age_stats(self):
        """Test age statistics."""
        url = reverse('age-stats')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, dict)
        self.assertIn('total_people', response.data)
        self.assertIn('data', response.data)

        # Check that percentages sum to 100
        total_percentage = sum(entry['percentage'] for entry in response.data['data'])
        self.assertAlmostEqual(total_percentage, 100.0, places=1)

    def test_empty_statistics(self):
        """Test statistics with no data."""
        # Clear all persons
        Person.objects.all().delete()

        urls = [
            reverse('body-type-stats'),
            reverse('gender-stats'),
            reverse('emotion-stats'),
            reverse('age-stats'),
        ]

        for url in urls:
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertIsInstance(response.data, dict)
            self.assertIn('total_people', response.data)
            self.assertIn('data', response.data)
            self.assertEqual(response.data['data'], [])
