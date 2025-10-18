# Nome.ai Backend API

## 📚 Documentation

### Quick Links
- **[📚 Documentation Hub](docs/README.md)** - Complete documentation index and navigation
- **[🔗 API Reference](docs/API_REFERENCE.md)** - Complete API documentation with examples and SDK code
- **[🚀 Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions and configuration
- **[🧪 Testing Guide](docs/TESTING.md)** - Comprehensive testing documentation and best practices

### Interactive Documentation
- **Swagger UI**: Available at `/api/docs/` when running the server
- **ReDoc**: Available at `/api/redoc/` for alternative API documentation
- **OpenAPI Schema**: Available at `/api/schema/` for integration purposes

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd nome-ai-backend/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database
python manage.py migrate
python manage.py loaddata fixtures/*.yaml

# Run server
python manage.py runserver

# Access API documentation
open http://localhost:8000/api/docs/
```

## Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Installation & Setup](#installation--setup)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Statistics & Analytics](#statistics--analytics)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

Nome.ai is a cutting-edge facial recognition and visitor analytics system designed for modern businesses. The backend API provides comprehensive functionality for managing person data, tracking visits, analyzing demographics, and generating real-time statistics.

### Key Capabilities
- **Facial Recognition**: Advanced vector-based person identification using 128-dimensional embeddings
- **Real-time Analytics**: Live visitor statistics and demographic analysis
- **Multi-organization Support**: Scalable architecture supporting multiple business entities
- **RESTful API**: Clean, well-documented REST endpoints with OpenAPI/Swagger integration
- **WebSocket Support**: Real-time notifications for person detection events
- **Comprehensive Statistics**: Detailed analytics on visits, demographics, emotions, and more

### 🎯 Main API Endpoints

| Category | Endpoint | Description |
|----------|----------|-------------|
| **👤 Person Management** | `POST /api/client/person/` | Create/update person with vector data |
| | `PUT /api/client/person/{id}/` | Update person information |
| | `GET /api/client/persons/` | List all persons (paginated) |
| **📊 Statistics** | `GET /api/client/statistics/visit-count/` | Visit count statistics |
| | `GET /api/client/statistics/gender/` | Gender distribution |
| | `GET /api/client/statistics/age/` | Age group statistics |
| | `GET /api/client/statistics/emotion/` | Emotion analysis |
| **🛒 Cart Management** | `POST /api/client/cart-products/bulk/` | Bulk create cart products |
| | `GET /api/client/person/{id}/orders/` | Get person's order history |
| **🔐 Authentication** | `POST /api/auth/login/` | User login |
| | `GET /api/auth/profile/` | Get user profile |

## Architecture

The system follows a modular Django architecture with clear separation of concerns:

```
backend/
├── config/                 # Django project configuration
│   ├── settings.py        # Main settings file
│   ├── urls.py           # URL routing
│   └── asgi.py           # ASGI configuration for WebSockets
├── core/                  # Core application
│   ├── models.py         # User model and base classes
│   ├── views.py          # Authentication and user management
│   └── serializers.py    # User-related serializers
├── client/                # Main business logic application
│   ├── models.py         # Person, Organization, Product, Cart models
│   ├── views.py          # API endpoints
│   ├── serializers.py    # Data serializers
│   ├── utils.py          # Utility functions
│   └── urls.py           # Client API routes
├── tests/                 # Comprehensive test suite
│   ├── test_person_vector_api.py
│   ├── test_person_update_api.py
│   ├── test_person_list_api.py
│   ├── test_statistics_api.py
│   ├── test_cart_product_api.py
│   └── test_person_order_history_api.py
└── fixtures/              # Sample data for development
    ├── persons.yaml
    ├── organizations.yaml
    └── products.yaml
```

### Design Principles
- **Single Responsibility**: Each module handles a specific domain
- **API-First Design**: All functionality exposed through RESTful APIs
- **Test-Driven Development**: Comprehensive test coverage for all endpoints
- **Scalable Architecture**: Designed to handle multiple organizations and high traffic
- **Real-time Capabilities**: WebSocket integration for live updates

## Technology Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Backend** | Django | 5.1.2 | Web framework |
| | Django REST Framework | 3.16.1 | API development |
| | Channels | 4.1.0 | WebSocket support |
| **Database** | PostgreSQL | 12+ | Primary database |
| | pgvector | 0.4.1 | Vector similarity search |
| **Documentation** | drf-spectacular | 0.27.2 | OpenAPI schema |
| | Swagger UI | - | Interactive docs |
| **Testing** | pytest | - | Testing framework |
| | Coverage | - | Code coverage |
| **Deployment** | Docker | - | Containerization |
| | Nginx | - | Reverse proxy |

## Features

### 1. Person Management
- **Vector-based Recognition**: Store and compare 128-dimensional facial embeddings
- **Duplicate Detection**: Automatic detection of similar faces using cosine similarity
- **Comprehensive Profiles**: Age, gender, emotion, body type tracking
- **Image Storage**: Secure image upload and management
- **Real-time Updates**: WebSocket notifications for new person detection

### 2. Analytics & Statistics
- **Visit Tracking**: Time-based visit statistics (hourly, daily, weekly, monthly)
- **Demographic Analysis**: Gender, age group, body type distributions
- **Emotion Tracking**: Real-time emotion detection and analysis
- **Custom Time Ranges**: Flexible period selection for analytics
- **Real-time Data**: Live statistics with automatic updates

### 3. Multi-Organization Support
- **Organization Isolation**: Complete data separation between organizations
- **Scalable Architecture**: Support for unlimited organizations
- **Private Keys**: Secure organization identification
- **Custom Branding**: Organization-specific configurations

### 4. Cart & Product Management
- **Shopping Cart Integration**: Track customer purchases
- **Bulk Operations**: Efficient mass product creation
- **Order History**: Complete purchase tracking per person
- **Product Catalog**: Comprehensive product management

### 5. User Authentication
- **Custom User Model**: Extended user profiles with additional fields
- **Session Management**: Secure session handling
- **Profile Management**: User profile updates and management
- **Password Security**: Secure password change functionality

## API Documentation

### Interactive Documentation
- **Swagger UI**: Available at `/api/docs/`
- **ReDoc**: Available at `/api/redoc/`
- **OpenAPI Schema**: Available at `/api/schema/`

### API Endpoints

#### Authentication (`/api/auth/`)
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update user profile
- `POST /api/auth/change-password/` - Change password

#### Person Management (`/api/client/`)
- `POST /api/client/person/` - Create/update person with vector data
- `PUT /api/client/person/{id}/` - Update person information
- `GET /api/client/persons/` - List all persons (paginated)
- `GET /api/client/person/{id}/orders/` - Get person's order history

#### Statistics (`/api/client/statistics/`)
- `GET /api/client/statistics/visit-count/` - Visit count statistics
- `GET /api/client/statistics/body-type/` - Body type distribution
- `GET /api/client/statistics/gender/` - Gender distribution
- `GET /api/client/statistics/emotion/` - Emotion statistics
- `GET /api/client/statistics/age/` - Age group statistics

#### Cart Management (`/api/client/`)
- `POST /api/client/cart-products/bulk/` - Bulk create cart products

### Response Formats
All API responses follow consistent JSON formatting:
```json
{
  "data": {...},
  "message": "Success message",
  "status": "success"
}
```

### Error Handling
Comprehensive error handling with appropriate HTTP status codes:
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side errors

## Installation & Setup

### Prerequisites
- Python 3.9+
- PostgreSQL 12+
- Redis (for WebSocket channels)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nome.ai/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Database setup**
   ```bash
   python manage.py migrate
   python manage.py loaddata fixtures/*.yaml
   ```

6. **Run development server**
   ```bash
   python manage.py runserver
   ```

### Docker Deployment

1. **Build and run with Docker**
   ```bash
   docker build -t nome-ai-backend .
   docker run -p 8000:8000 nome-ai-backend
   ```

### Environment Variables
```env
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=true
DATABASE_URL=postgresql://user:password@localhost:5432/nomeai
REDIS_URL=redis://localhost:6379/0
```

## Database Schema

### Core Models

#### User Model
```python
class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)
    avatar = models.ImageField(upload_to='avatars/')
    is_verified = models.BooleanField(default=False)
    last_login_ip = models.GenericIPAddressField()
```

#### Organization Model
```python
class Organization(BaseModel):
    name = models.CharField(max_length=255, unique=True)
    private_key = models.CharField(max_length=25, unique=True)
```

#### Person Model
```python
class Person(BaseModel):
    organization = models.ForeignKey(Organization)
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=255)
    vector = VectorField(dimensions=128)  # Facial embedding
    image = models.ImageField(upload_to="people/")
    age = models.IntegerField()
    gender = models.CharField(max_length=255)
    emotion = models.CharField(max_length=255)
    body_type = models.CharField(max_length=255)
    entry_time = models.DateTimeField()
    exit_time = models.DateTimeField()
```

### Vector Similarity Search
The system uses pgvector for efficient facial recognition:
- **128-dimensional vectors** for facial embeddings
- **Cosine similarity** for face comparison
- **Configurable similarity threshold** (default: 0.95)
- **Automatic duplicate detection**

## Authentication

### Session-based Authentication
- Secure session management with configurable expiration
- CSRF protection for all state-changing operations
- IP address tracking for security monitoring

### User Registration
- Email-based registration with validation
- Automatic profile creation
- Secure password hashing

### API Security
- CORS configuration for cross-origin requests
- Rate limiting for API endpoints
- Input validation and sanitization

## Statistics & Analytics

### Visit Tracking
- **Time-based Analysis**: Hourly, daily, weekly, monthly statistics
- **Real-time Updates**: Live data with automatic refresh
- **Custom Periods**: Flexible time range selection
- **Data Aggregation**: Efficient grouping and counting

### Demographic Analysis
- **Gender Distribution**: Percentage breakdown by gender
- **Age Groups**: Categorized age analysis (0-18, 19-30, 31-50, 51+)
- **Body Type Analysis**: Physical characteristics tracking
- **Emotion Detection**: Real-time emotion analysis

### Data Visualization
- **Chart-ready Data**: JSON responses optimized for frontend charts
- **Consistent Formatting**: Standardized data structure
- **Empty State Handling**: Graceful handling of no-data scenarios

## Testing

### Test Coverage
Comprehensive test suite covering:
- **API Endpoints**: All REST endpoints tested
- **Authentication**: Login, logout, profile management
- **Person Management**: CRUD operations, vector validation
- **Statistics**: All analytics endpoints
- **Error Handling**: Edge cases and error scenarios
- **Data Validation**: Input validation and sanitization

### Running Tests
```bash
# Run all tests
python manage.py test

# Run specific test file
python manage.py test tests.test_person_vector_api

# Run with coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

### Test Structure
- **Integration Tests**: Full API workflow testing
- **Unit Tests**: Individual component testing
- **Mock Data**: Realistic test data generation
- **Edge Cases**: Boundary condition testing

## Deployment

### Production Configuration
- **Environment Variables**: Secure configuration management
- **Database Optimization**: PostgreSQL tuning for performance
- **Static File Serving**: WhiteNoise for efficient file delivery
- **Security Headers**: Comprehensive security configuration

### Scaling Considerations
- **Database Indexing**: Optimized queries for large datasets
- **Caching Strategy**: Redis for session and data caching
- **Load Balancing**: Horizontal scaling support
- **CDN Integration**: Static asset optimization

### Monitoring & Logging
- **Health Checks**: API endpoint monitoring
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response time monitoring
- **Usage Analytics**: API usage tracking

## Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Implement the feature
5. Ensure all tests pass
6. Submit a pull request

### Code Standards
- **PEP 8**: Python code style guidelines
- **Type Hints**: Comprehensive type annotations
- **Docstrings**: Detailed function and class documentation
- **Error Handling**: Robust error management

### Testing Requirements
- **Test Coverage**: Minimum 90% code coverage
- **Integration Tests**: All API endpoints must be tested
- **Performance Tests**: Load testing for critical endpoints
- **Security Tests**: Authentication and authorization testing

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📖 Additional Documentation

### Detailed Guides
- **[📚 Documentation Hub](docs/README.md)** - Complete documentation index and navigation
- **[🔗 API Reference](docs/API_REFERENCE.md)** - Complete API documentation with examples and SDK code
- **[🚀 Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment instructions and configuration  
- **[🧪 Testing Guide](docs/TESTING.md)** - Comprehensive testing documentation and best practices

### Interactive Documentation
- **Swagger UI**: Available at `/api/docs/` when running the server
- **ReDoc**: Available at `/api/redoc/` for alternative API documentation
- **OpenAPI Schema**: Available at `/api/schema/` for integration purposes

## Support

For technical support or questions:
- **Email**: support@nomeai.space
- **Documentation**: [API Docs](https://nome-ai-t5lly.ondigitalocean.app/api/docs/)
- **Issues**: GitHub Issues for bug reports and feature requests

---

**Nome.ai** - Advanced facial recognition and visitor analytics for modern businesses.
