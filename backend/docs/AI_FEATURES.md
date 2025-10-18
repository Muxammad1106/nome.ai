# AI Features Documentation

## Overview

Nome.ai uses OpenAI GPT-3.5-turbo to generate personalized customer insights based on their visit history and orders.

## Key Features

### 1. Personalized Customer Analysis

The `/api/client/person/{person_id}/summary/` endpoint provides:

- **AI-generated summary** about customer preferences
- **Favorite dishes** with order counts
- **Favorite table** of the customer
- **Visit statistics** and total number of ordered items

### 2. Age Categories

The system automatically categorizes customers into 8 age groups:

| Age | Category | Name |
|-----|----------|------|
| 0-10 | `0-10` | child |
| 11-18 | `10-18` | teenager |
| 19-25 | `18-25` | young adult |
| 26-35 | `25-35` | adult |
| 36-45 | `35-45` | mature adult |
| 46-55 | `45-55` | middle-aged |
| 56-65 | `55-65` | senior |
| 66+ | `65+` | elderly |

## Configuration

### Requirements

1. **AI API Key**: Set the required API key in your `.env` file
2. **Environment Variable**: Configure `OPENAI_API_KEY` for AI-powered features

```bash
OPENAI_API_KEY=your-api-key-here
```

## API Usage

### Getting AI Customer Summary

```bash
curl -X GET https://nome-ai-t5lly.ondigitalocean.app/api/client/person/{person_id}/summary/
```

**Example Response:**

```json
{
  "person_id": "550e8400-e29b-41d4-a716-446655440000",
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
    }
  ],
  "ai_summary": "John Doe is a loyal customer who frequently visits the restaurant, with 15 total visits. He shows a strong preference for table 5 and consistently orders Pizza Margherita, having ordered it 8 times. His dining patterns suggest he enjoys Italian cuisine and appreciates consistency in his dining experience.",
  "last_visit": "2024-10-15T19:30:00Z",
  "total_spent_items": 45
}
```

## How It Works

The system automatically analyzes customer data and generates personalized insights:

1. **Data Collection**: Gathers complete customer order history, table preferences, and demographic data
2. **Pattern Analysis**: Identifies favorite dishes, preferred tables, and behavioral patterns
3. **Insight Generation**: Creates a personalized summary that helps staff better serve customers

## Error Handling

The system handles errors gracefully:

- **Missing Configuration**: Returns a message if AI features are not configured
- **API Errors**: Provides descriptive error messages when AI generation fails
- **Fallback**: Other data (favorite dishes, tables, statistics) work regardless of AI status

## Performance Optimization

### Recommendations

1. **Caching**: Cache AI summaries for frequently requested customers
2. **Rate Limiting**: Implement request limits to control API usage
3. **Monitoring**: Track usage and performance metrics

## Security

### Best Practices

1. **API Key Protection**: Never commit API keys to version control
2. **Data Validation**: All data is validated before processing
3. **Privacy**: Sensitive information is handled securely

## Monitoring

### Key Metrics

Monitor the following:
- Number of AI requests
- Average response time
- Success rate
- Error frequency

Check application logs for AI-related events and errors.

## Integration Examples

### Python

```python
import requests

# Get AI summary
response = requests.get(
    'https://nome-ai-t5lly.ondigitalocean.app/api/client/person/uuid/summary/'
)
data = response.json()

print(f"AI Insights: {data['ai_summary']}")
print(f"Top dishes: {data['favorite_dishes']}")
```

### JavaScript

```javascript
// Get AI summary
const response = await fetch('/api/client/person/uuid/summary/');
const data = await response.json();

console.log('AI Insights:', data.ai_summary);
console.log('Top dishes:', data.favorite_dishes);
```

### cURL

```bash
curl -X GET \
  'https://nome-ai-t5lly.ondigitalocean.app/api/client/person/uuid/summary/' \
  -H 'Content-Type: application/json'
```

## Frequently Asked Questions

### What language are summaries in?

AI summaries are generated in English by default. The language can be configured in the system settings.

### What if AI features aren't working?

Check that:
1. API key is properly configured in `.env`
2. API service is accessible
3. Application logs for specific error messages

### How can I optimize performance?

- Implement caching for frequently requested summaries
- Add rate limiting to control request volume
- Monitor usage patterns and adjust accordingly

## Implementation Notes

The AI integration is implemented in `backend/client/utils.py` with the `_generate_ai_summary()` function. For implementation details, refer to the source code.

## Support

For AI feature questions:
- **Email**: support@nomeai.space
- **GitHub Issues**: Report problems
- **Documentation**: [API Docs](https://nome-ai-t5lly.ondigitalocean.app/api/docs/)

---

**Last Updated**: October 2025
**Version**: 1.0.0

