# 🧪 Test Runner Instructions

## Quick Test Run

```bash
# Run all tests
python manage.py test

# Run specific test file
python manage.py test tests.test_simple

# Run with verbose output
python manage.py test --verbosity=2

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

## Test Configuration

The project uses separate test settings to avoid database conflicts:

- **Test Database**: `nomeai_test` (separate from production)
- **Test Settings**: `config.test_settings`
- **Migrations**: Disabled for faster test execution

## Fixed Issues

### 1. Person Update Validation
- Added age validation (0-120 years)
- Added gender validation (Male, Female, Other)
- Tests now properly validate invalid data

### 2. Person Vector API
- Made all fields optional in PersonVectorSerializer
- Fixed test data to include required fields
- Updated duplicate detection test

### 3. Database Issues
- Created separate test database configuration
- Disabled migrations for faster tests
- Added proper test cleanup

## Test Structure

```
tests/
├── test_simple.py              # Basic functionality tests
├── test_person_vector_api.py   # Person vector API tests
├── test_person_update_api.py   # Person update API tests
├── test_person_list_api.py     # Person list API tests
├── test_statistics_api.py      # Statistics API tests
├── test_cart_product_api.py    # Cart product API tests
└── test_person_order_history_api.py  # Order history tests
```

## Running Tests in Production

```bash
# In DigitalOcean console
python manage.py test --settings=config.test_settings

# Or use the test runner script
python run_tests.py
```

## Expected Results

After fixes, all tests should pass:
- ✅ 35 tests total
- ✅ 0 failures
- ✅ Clean database teardown
