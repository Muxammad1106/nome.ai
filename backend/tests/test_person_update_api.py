"""Integration tests for Person Update API."""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from client.models import Person, Organization
from datetime import datetime


class PersonUpdateAPITestCase(TestCase):
    """Test cases for Person Update API."""

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

    def test_update_person_success(self):
        """Test successful person update."""
        url = reverse('person-update', kwargs={'person_id': self.person.id})
        data = {
            'full_name': 'Updated Name',
            'age': 30,
            'gender': 'Male',
            'emotion': 'Neutral',
            'body_type': 'Athletic'
        }

        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Refresh person from database
        self.person.refresh_from_db()
        self.assertEqual(self.person.full_name, 'Updated Name')
        self.assertEqual(self.person.age, 30)
        self.assertEqual(self.person.gender, 'Male')

    def test_update_person_partial(self):
        """Test partial person update."""
        url = reverse('person-update', kwargs={'person_id': self.person.id})
        data = {
            'age': 35
        }

        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Refresh person from database
        self.person.refresh_from_db()
        self.assertEqual(self.person.age, 35)
        # Other fields should remain unchanged
        self.assertEqual(self.person.full_name, 'Test Person')

    def test_update_nonexistent_person(self):
        """Test updating non-existent person."""
        fake_uuid = '00000000-0000-0000-0000-000000000000'
        url = reverse('person-update', kwargs={'person_id': fake_uuid})
        data = {'age': 30}

        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('Person не найден', str(response.data))

    def test_update_person_invalid_data(self):
        """Test updating person with invalid data."""
        url = reverse('person-update', kwargs={'person_id': self.person.id})
        data = {
            'age': -5,  # Invalid age
            'gender': 'InvalidGender'  # Invalid gender
        }

        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_person_empty_data(self):
        """Test updating person with empty data."""
        url = reverse('person-update', kwargs={'person_id': self.person.id})
        data = {}

        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
