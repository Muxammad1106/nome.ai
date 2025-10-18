# Nome.ai API Reference

## Base URL
```
Production: https://nome-ai-t5lly.ondigitalocean.app/api/
Development: http://localhost:8000/api/
```

## Authentication

The API uses session-based authentication. Include session cookies in requests for authenticated endpoints.

### Login
```http
POST /api/auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Успешный вход в систему",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_verified": true
  }
}
```

## Person Management

### Create/Update Person with Vector Data
```http
POST /api/client/person/
Content-Type: multipart/form-data

{
  "vector": "[0.1, 0.2, ...]",  // 128-dimensional array
  "age": 25,
  "gender": "Female",
  "emotion": "Happy",
  "body_type": "Normal",
  "entry_time": "2024-12-01T10:00:00Z",
  "exit_time": "2024-12-01T11:00:00Z",
  "image": <file>
}
```

**Response:**
```json
{
  "id": "uuid",
  "vector": [0.1, 0.2, ...],
  "image": "people/person.jpg",
  "age": 25,
  "gender": "Female",
  "emotion": "Happy",
  "body_type": "Normal",
  "entry_time": "2024-12-01T10:00:00Z",
  "exit_time": "2024-12-01T11:00:00Z"
}
```

### Update Person Information
```http
PUT /api/client/person/{person_id}/
Content-Type: application/json

{
  "full_name": "John Doe",
  "phone_number": "+998901234567",
  "age": 30,
  "gender": "Male",
  "emotion": "Neutral",
  "body_type": "Athletic"
}
```

### List Persons (Paginated)
```http
GET /api/client/persons/?page=1&page_size=10
```

**Response:**
```json
{
  "count": 100,
  "total_pages": 10,
  "current_page": 1,
  "page_size": 10,
  "has_next": true,
  "has_previous": false,
  "next_page": 2,
  "previous_page": null,
  "results": [
    {
      "id": "uuid",
      "full_name": "John Doe",
      "phone_number": "+998901234567",
      "age": 30,
      "gender": "Male",
      "emotion": "Happy",
      "body_type": "Athletic",
      "entry_time": "2024-12-01T10:00:00Z",
      "exit_time": "2024-12-01T11:00:00Z",
      "created_at": "2024-12-01T10:00:00Z",
      "updated_at": "2024-12-01T11:00:00Z"
    }
  ]
}
```

### Get Person Order History
```http
GET /api/client/person/{person_id}/orders/
```

**Response:**
```json
{
  "person_id": "uuid",
  "person_name": "John Doe",
  "total_orders": 2,
  "orders": [
    {
      "cart_id": "uuid",
      "cart_created_at": "2024-12-01T10:00:00Z",
      "cart_updated_at": "2024-12-01T10:30:00Z",
      "products": [
        {
          "product_id": "uuid",
          "product_name": "Product 1",
          "added_at": "2024-12-01T10:00:00Z"
        }
      ],
      "total_products": 1
    }
  ]
}
```

## Statistics & Analytics

### Visit Count Statistics
```http
GET /api/client/statistics/visit-count/?type=week
```

**Parameters:**
- `type`: `last_6_hours`, `day`, `week`, `month`

**Response:**
```json
[
  {
    "date": "2024-12-01",
    "value": 15
  },
  {
    "date": "2024-12-02",
    "value": 23
  }
]
```

### Body Type Statistics
```http
GET /api/client/statistics/body-type/
```

**Response:**
```json
[
  {
    "type": "Normal",
    "percentage": 45.5
  },
  {
    "type": "Athletic",
    "percentage": 30.2
  },
  {
    "type": "Slim",
    "percentage": 24.3
  }
]
```

### Gender Statistics
```http
GET /api/client/statistics/gender/
```

**Response:**
```json
[
  {
    "type": "Female",
    "percentage": 55.0
  },
  {
    "type": "Male",
    "percentage": 45.0
  }
]
```

### Emotion Statistics
```http
GET /api/client/statistics/emotion/
```

**Response:**
```json
[
  {
    "type": "Happy",
    "value": 25
  },
  {
    "type": "Neutral",
    "value": 18
  },
  {
    "type": "Sad",
    "value": 7
  }
]
```

### Age Statistics
```http
GET /api/client/statistics/age/
```

**Response:**
```json
[
  {
    "type": "18-30",
    "percentage": 40.0
  },
  {
    "type": "31-50",
    "percentage": 35.0
  },
  {
    "type": "51+",
    "percentage": 25.0
  }
]
```

## Cart Management

### Bulk Create Cart Products
```http
POST /api/client/cart-products/bulk/
Content-Type: application/json

{
  "cart_products": [
    {
      "organization": "uuid",
      "cart": "uuid",
      "product": "uuid"
    },
    {
      "organization": "uuid",
      "cart": "uuid",
      "product": "uuid"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Успешно создано 2 товаров в корзинах",
  "created_count": 2,
  "cart_products": [
    {
      "id": "uuid",
      "organization": "uuid",
      "cart": "uuid",
      "product": "uuid",
      "created_at": "2024-12-01T10:00:00Z",
      "updated_at": "2024-12-01T10:00:00Z"
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid data provided",
  "details": {
    "field_name": ["Error message"]
  }
}
```

### 404 Not Found
```json
{
  "error": "Person не найден"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error occurred"
}
```

## Rate Limiting

- **Default**: 1000 requests per hour per IP
- **Authentication endpoints**: 10 requests per minute per IP
- **Statistics endpoints**: 100 requests per hour per IP

## WebSocket Events

### Person Joined Event
```json
{
  "event": "person_joined",
  "person": {
    "id": "uuid",
    "full_name": "John Doe",
    "age": 30,
    "gender": "Male",
    "emotion": "Happy",
    "body_type": "Athletic"
  }
}
```

## Data Models

### Person
```typescript
interface Person {
  id: string;
  organization: string;
  full_name?: string;
  phone_number?: string;
  vector?: number[];  // 128 dimensions
  image?: string;
  age?: number;
  gender?: string;
  emotion?: string;
  body_type?: string;
  entry_time?: string;
  exit_time?: string;
  created_at: string;
  updated_at: string;
}
```

### Organization
```typescript
interface Organization {
  id: string;
  name: string;
  private_key: string;
  created_at: string;
  updated_at: string;
}
```

### Product
```typescript
interface Product {
  id: string;
  organization: string;
  name: string;
  created_at: string;
  updated_at: string;
}
```

### Cart
```typescript
interface Cart {
  id: string;
  organization: string;
  person: string;
  created_at: string;
  updated_at: string;
}
```

### CartProduct
```typescript
interface CartProduct {
  id: string;
  organization: string;
  cart: string;
  product: string;
  created_at: string;
  updated_at: string;
}
```

## SDK Examples

### Python
```python
import requests

# Login
session = requests.Session()
response = session.post('https://nome-ai-t5lly.ondigitalocean.app/api/auth/login/', {
    'email': 'user@example.com',
    'password': 'password123'
})

# Create person
person_data = {
    'vector': json.dumps([0.1] * 128),
    'age': 25,
    'gender': 'Female',
    'emotion': 'Happy',
    'body_type': 'Normal'
}
response = session.post('https://nome-ai-t5lly.ondigitalocean.app/api/client/person/', 
                       data=person_data)
```

### JavaScript
```javascript
// Login
const response = await fetch('/api/auth/login/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

// Get statistics
const stats = await fetch('/api/client/statistics/visit-count/?type=week');
const data = await stats.json();
```

## Webhook Integration

### Person Detection Webhook
```http
POST https://your-webhook-url.com/person-detected
Content-Type: application/json

{
  "event": "person_joined",
  "timestamp": "2024-12-01T10:00:00Z",
  "person": {
    "id": "uuid",
    "full_name": "John Doe",
    "age": 30,
    "gender": "Male",
    "emotion": "Happy",
    "body_type": "Athletic"
  },
  "organization": {
    "id": "uuid",
    "name": "Bella Vista Restaurant"
  }
}
```
