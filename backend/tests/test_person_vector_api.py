"""Integration tests for Person Vector API."""
import json
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from client.models import Person, Organization
from django.core.files.uploadedfile import SimpleUploadedFile


class PersonVectorAPITestCase(TestCase):
    """Test cases for Person Vector API."""

    def setUp(self):
        """Set up test data."""
        self.client = APIClient()
        self.organization = Organization.objects.create(
            name="Test Organization",
            private_key="TEST001"
        )
        self.url = reverse('person-vector')

    def test_create_person_with_vector(self):
        """Test creating a person with vector data."""
        vector_data = [0.1] * 128  # 128-dimensional vector
        data = {
            'vector': json.dumps(vector_data),
            'age': 25,
            'gender': 'Female',
            'emotion': 'Happy',
            'body_type': 'Normal',
            'entry_time': '2024-12-01T10:00:00Z',
            'exit_time': '2024-12-01T11:00:00Z'
        }

        response = self.client.post(self.url, data, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Person.objects.filter(age=25).exists())
        
        person = Person.objects.get(age=25)
        self.assertEqual(person.gender, 'Female')
        self.assertEqual(person.emotion, 'Happy')
        self.assertEqual(person.body_type, 'Normal')

    def test_create_person_without_vector(self):
        """Test creating a person without vector data."""
        data = {
            'age': 30,
            'gender': 'Male',
            'emotion': 'Neutral',
            'body_type': 'Athletic',
            'entry_time': '2024-12-01T10:00:00Z',
            'exit_time': '2024-12-01T11:00:00Z'
        }

        response = self.client.post(self.url, data, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Person.objects.filter(age=30).exists())

    def test_invalid_vector_dimensions(self):
        """Test with invalid vector dimensions."""
        vector_data = [0.1] * 64  # Wrong dimensions
        data = {
            'vector': json.dumps(vector_data),
            'age': 25,
            'gender': 'Female',
            'emotion': 'Happy',
            'body_type': 'Normal'
        }

        response = self.client.post(self.url, data, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Vector must contain 128 values', str(response.data))

    def test_invalid_age(self):
        """Test with invalid age values."""
        data = {
            'age': -5,  # Negative age
            'gender': 'Female',
            'emotion': 'Happy',
            'body_type': 'Normal'
        }

        response = self.client.post(self.url, data, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Возраст не может быть отрицательным', str(response.data))

    def test_duplicate_detection(self):
        """Test duplicate person detection based on vector similarity."""
        vector_data = [0.1] * 128
        data = {
            'vector': json.dumps(vector_data),
            'age': 25,
            'gender': 'Female',
            'emotion': 'Happy',
            'body_type': 'Normal'
        }

        # Create first person
        response1 = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        
        # Try to create similar person
        response2 = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        
        # Should return the same person (duplicate detection)
        self.assertEqual(response1.data['id'], response2.data['id'])

    def test_missing_required_fields(self):
        """Test with missing required fields."""
        data = {
            'age': 25,
            # Missing gender, emotion, body_type
        }

        response = self.client.post(self.url, data, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
