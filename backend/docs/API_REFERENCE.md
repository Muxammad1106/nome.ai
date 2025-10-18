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
  "message": "Login successful",
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

### Get Person Details
```http
GET /api/client/person/{person_id}/detail/
```

**Description:**
Returns detailed person information including all carts and products.

**Response:**
```json
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
  "created_at": "2024-12-01T09:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z",
  "carts": [
    {
      "id": "uuid",
      "table_number": 5,
      "created_at": "2024-12-01T10:00:00Z",
      "updated_at": "2024-12-01T10:30:00Z",
      "products": [
        {
          "id": "uuid",
          "name": "Pizza Margherita",
          "created_at": "2024-12-01T10:05:00Z"
        },
        {
          "id": "uuid",
          "name": "Coca-Cola",
          "created_at": "2024-12-01T10:10:00Z"
        }
      ]
    }
  ]
}
```

### Get Person Summary with AI Analysis
```http
GET /api/client/person/{person_id}/summary/
```

**Description:**
Returns a comprehensive person summary with preference analysis and AI-generated insights.

**Response:**
```json
{
  "person_id": "uuid",
  "person_name": "John Doe",
  "total_visits": 15,
  "favorite_table": 5,
  "favorite_dishes": [
    {
      "dish": "Pizza Margherita",
      "count": 8
    },
    {
      "dish": "Caesar Salad",
      "count": 6
    },
    {
      "dish": "Coca-Cola",
      "count": 12
    }
  ],
  "ai_summary": "John Doe is a regular customer who visits frequently and prefers table 5. His favorite dish is Pizza Margherita, which he has ordered 8 times. He typically orders beverages with his meals, particularly Coca-Cola. His dining patterns suggest a preference for Italian cuisine and casual dining experiences.",
  "last_visit": "2024-12-15T19:30:00Z",
  "total_spent_items": 45
}
```

**Features:**
- Automatic customer preference analysis
- AI-generated personalized summary
- Statistics on favorite dishes and tables
- Visit history and total order volume

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
  "message": "Successfully created 2 cart products",
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
  "error": "Person not found"
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
import json

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

# Get person summary with AI analysis
person_id = response.json()['id']
summary = session.get(f'https://nome-ai-t5lly.ondigitalocean.app/api/client/person/{person_id}/summary/')
summary_data = summary.json()
print(f"AI Summary: {summary_data['ai_summary']}")
print(f"Favorite table: {summary_data['favorite_table']}")
print(f"Favorite dishes: {summary_data['favorite_dishes']}")

# Get person details
details = session.get(f'https://nome-ai-t5lly.ondigitalocean.app/api/client/person/{person_id}/detail/')
details_data = details.json()
for cart in details_data['carts']:
    print(f"Cart {cart['id']} at table {cart['table_number']}:")
    for product in cart['products']:
        print(f"  - {product['name']}")
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

// Get person summary with AI analysis
const summary = await fetch('/api/client/person/uuid/summary/');
const summaryData = await summary.json();
console.log(summaryData.ai_summary);  // AI-generated insights
console.log(summaryData.favorite_dishes);  // Top dishes

// Get person details with carts
const details = await fetch('/api/client/person/uuid/detail/');
const detailsData = await details.json();
console.log(detailsData.carts);  // All carts with products
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
