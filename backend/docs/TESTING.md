# Nome.ai Backend Testing Guide

## Overview

This document provides comprehensive testing instructions for the Nome.ai backend API. The test suite includes integration tests for all API endpoints, covering authentication, person management, statistics, and cart operations.

## Test Structure

```
tests/
├── __init__.py
├── test_person_vector_api.py      # Person vector creation and management
├── test_person_update_api.py      # Person information updates
├── test_person_list_api.py        # Person listing with pagination
├── test_statistics_api.py         # All statistics endpoints
├── test_cart_product_api.py       # Cart and product management
└── test_person_order_history_api.py # Order history functionality
```

## Running Tests

### Prerequisites

1. **Database Setup**: Ensure PostgreSQL is running and accessible
2. **Dependencies**: Install all required packages from `requirements.txt`
3. **Environment**: Set up proper environment variables

### Basic Test Execution

```bash
# Run all tests
python manage.py test

# Run tests with verbose output
python manage.py test --verbosity=2

# Run specific test file
python manage.py test tests.test_person_vector_api

# Run specific test class
python manage.py test tests.test_person_vector_api.PersonVectorAPITestCase

# Run specific test method
python manage.py test tests.test_person_vector_api.PersonVectorAPITestCase.test_create_person_with_vector
```

### Test Coverage

```bash
# Install coverage if not already installed
pip install coverage

# Run tests with coverage
coverage run --source='.' manage.py test

# Generate coverage report
coverage report

# Generate HTML coverage report
coverage html

# Open coverage report in browser
open htmlcov/index.html
```

### Parallel Test Execution

```bash
# Install pytest-xdist for parallel testing
pip install pytest-xdist

# Run tests in parallel (4 workers)
python -m pytest tests/ -n 4

# Run tests with coverage in parallel
coverage run --source='.' -m pytest tests/ -n 4
```

## Test Categories

### 1. Person Vector API Tests (`test_person_vector_api.py`)

**Purpose**: Test person creation with vector data and facial recognition features.

**Key Test Cases**:
- `test_create_person_with_vector()`: Create person with 128-dimensional vector
- `test_create_person_without_vector()`: Create person without vector data
- `test_invalid_vector_dimensions()`: Test with incorrect vector dimensions
- `test_invalid_age()`: Test age validation
- `test_duplicate_detection()`: Test facial similarity detection
- `test_missing_required_fields()`: Test required field validation

**Test Data**:
```python
vector_data = [0.1] * 128  # 128-dimensional vector
person_data = {
    'vector': json.dumps(vector_data),
    'age': 25,
    'gender': 'Female',
    'emotion': 'Happy',
    'body_type': 'Normal',
    'entry_time': '2024-12-01T10:00:00Z',
    'exit_time': '2024-12-01T11:00:00Z'
}
```

### 2. Person Update API Tests (`test_person_update_api.py`)

**Purpose**: Test person information updates and validation.

**Key Test Cases**:
- `test_update_person_success()`: Successful person update
- `test_update_person_partial()`: Partial update with some fields
- `test_update_nonexistent_person()`: Update non-existent person
- `test_update_person_invalid_data()`: Update with invalid data
- `test_update_person_empty_data()`: Update with empty data

### 3. Person List API Tests (`test_person_list_api.py`)

**Purpose**: Test person listing with pagination and filtering.

**Key Test Cases**:
- `test_get_person_list_default_pagination()`: Default pagination (10 items)
- `test_get_person_list_custom_pagination()`: Custom page size and page number
- `test_get_person_list_invalid_pagination()`: Invalid pagination parameters
- `test_get_person_list_page_size_limit()`: Page size limit enforcement (max 100)
- `test_get_person_list_nonexistent_page()`: Non-existent page handling
- `test_get_person_list_ordering()`: Verify created_at descending order
- `test_get_person_list_pagination_metadata()`: Pagination metadata validation

### 4. Statistics API Tests (`test_statistics_api.py`)

**Purpose**: Test all statistics and analytics endpoints.

**Key Test Cases**:
- `test_visit_count_stats_week()`: Weekly visit statistics
- `test_visit_count_stats_day()`: Daily visit statistics
- `test_visit_count_stats_invalid_type()`: Invalid period type handling
- `test_body_type_stats()`: Body type distribution
- `test_gender_stats()`: Gender distribution
- `test_emotion_stats()`: Emotion statistics
- `test_age_stats()`: Age group statistics
- `test_empty_statistics()`: Empty data handling

**Test Data Setup**:
```python
# Create test persons with different attributes
persons_data = [
    {'age': 25, 'gender': 'Female', 'emotion': 'Happy', 'body_type': 'Normal'},
    {'age': 30, 'gender': 'Male', 'emotion': 'Neutral', 'body_type': 'Athletic'},
    {'age': 35, 'gender': 'Female', 'emotion': 'Sad', 'body_type': 'Slim'},
    {'age': 40, 'gender': 'Male', 'emotion': 'Angry', 'body_type': 'Heavy'},
    {'age': 45, 'gender': 'Female', 'emotion': 'Happy', 'body_type': 'Normal'},
]
```

### 5. Cart Product API Tests (`test_cart_product_api.py`)

**Purpose**: Test cart and product management functionality.

**Key Test Cases**:
- `test_bulk_cart_product_create_success()`: Successful bulk creation
- `test_bulk_cart_product_create_duplicate()`: Duplicate product handling
- `test_bulk_cart_product_create_empty_list()`: Empty list validation
- `test_bulk_cart_product_create_invalid_data()`: Invalid data handling
- `test_bulk_cart_product_create_max_limit()`: Maximum limit enforcement (100 items)

### 6. Person Order History API Tests (`test_person_order_history_api.py`)

**Purpose**: Test order history retrieval and data formatting.

**Key Test Cases**:
- `test_get_person_order_history_success()`: Successful history retrieval
- `test_get_person_order_history_no_orders()`: No orders scenario
- `test_get_person_order_history_nonexistent_person()`: Non-existent person handling
- `test_get_person_order_history_with_products()`: Detailed product information

## Test Configuration

### Database Configuration

Tests use a separate test database to avoid affecting production data:

```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'nomeai_test',
        'USER': 'nomeai',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Test Data Management

Each test class includes:
- `setUp()`: Initialize test data before each test
- `tearDown()`: Clean up after each test (if needed)
- Test data isolation to prevent test interference

### Mock Data

Tests use realistic mock data:
- **Person Data**: Age, gender, emotion, body type variations
- **Vector Data**: 128-dimensional arrays for facial recognition
- **Time Data**: Realistic timestamps for statistics testing
- **Organization Data**: Multiple organizations for multi-tenancy testing

## Performance Testing

### Load Testing

```bash
# Install locust for load testing
pip install locust

# Create locustfile.py for load testing
# Run load tests
locust -f locustfile.py --host=http://localhost:8000
```

### Database Performance

```python
# Test database query performance
from django.test.utils import override_settings
from django.db import connection
from django.test import TestCase

class PerformanceTestCase(TestCase):
    def test_query_performance(self):
        with override_settings(DEBUG=True):
            # Your test code here
            queries = len(connection.queries)
            self.assertLess(queries, 10)  # Ensure efficient queries
```

## Continuous Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:12
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: nomeai_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
    
    - name: Run tests
      run: |
        python manage.py test
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/nomeai_test
```

## Debugging Tests

### Verbose Output

```bash
# Run tests with maximum verbosity
python manage.py test --verbosity=3

# Run specific test with debug output
python manage.py test tests.test_person_vector_api.PersonVectorAPITestCase.test_create_person_with_vector --verbosity=3
```

### Debug Mode

```python
# Add debug statements in tests
def test_create_person_with_vector(self):
    print("Starting test...")
    response = self.client.post(self.url, data, format='multipart')
    print(f"Response status: {response.status_code}")
    print(f"Response data: {response.data}")
    self.assertEqual(response.status_code, status.HTTP_200_OK)
```

### Database Inspection

```python
# Inspect database state during tests
def test_create_person_with_vector(self):
    # Before
    person_count_before = Person.objects.count()
    
    # Test action
    response = self.client.post(self.url, data, format='multipart')
    
    # After
    person_count_after = Person.objects.count()
    self.assertEqual(person_count_after, person_count_before + 1)
```

## Test Best Practices

### 1. Test Isolation
- Each test should be independent
- Use `setUp()` and `tearDown()` for cleanup
- Avoid shared state between tests

### 2. Descriptive Test Names
```python
def test_create_person_with_valid_vector_data_returns_200_ok(self):
    # Test implementation
```

### 3. Assertion Clarity
```python
# Good
self.assertEqual(response.status_code, status.HTTP_200_OK)
self.assertIn('id', response.data)

# Better
self.assertEqual(response.status_code, status.HTTP_200_OK, 
                 f"Expected 200 OK, got {response.status_code}: {response.data}")
```

### 4. Test Data Management
```python
# Use factories for complex data
from factory import DjangoModelFactory

class PersonFactory(DjangoModelFactory):
    class Meta:
        model = Person
    
    full_name = "Test Person"
    age = 25
    gender = "Female"
```

### 5. Error Testing
```python
def test_invalid_data_returns_400_bad_request(self):
    invalid_data = {"invalid": "data"}
    response = self.client.post(self.url, invalid_data)
    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertIn('error', response.data)
```

## Coverage Goals

- **Overall Coverage**: 90%+
- **API Endpoints**: 100%
- **Critical Business Logic**: 100%
- **Error Handling**: 90%+

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql
   
   # Check database exists
   psql -U nomeai -d nomeai_test -c "SELECT 1;"
   ```

2. **Import Errors**
   ```bash
   # Check Python path
   python -c "import sys; print(sys.path)"
   
   # Install missing packages
   pip install -r requirements.txt
   ```

3. **Test Data Issues**
   ```python
   # Check test data setup
   def setUp(self):
       print(f"Person count: {Person.objects.count()}")
       print(f"Organization count: {Organization.objects.count()}")
   ```

### Performance Issues

1. **Slow Tests**
   - Use database transactions for faster cleanup
   - Mock external services
   - Use `setUpClass()` for expensive setup

2. **Memory Issues**
   - Clean up test data properly
   - Use `tearDown()` methods
   - Monitor memory usage during tests

## Conclusion

The test suite provides comprehensive coverage of all API functionality, ensuring reliability and maintainability of the Nome.ai backend. Regular test execution helps catch regressions early and maintains code quality.

For questions or issues with testing:
- **Email**: support@nomeai.space
- **Documentation**: [API Docs](https://nome-ai-t5lly.ondigitalocean.app/api/docs/)
- **Issues**: GitHub Issues for test-related problems
