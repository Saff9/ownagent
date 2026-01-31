# Memory API

## Endpoints

### GET /api/v1/memory/facts
Get all memory facts

**Query Parameters:**
- `category` (optional): Filter by category
- `limit` (optional): Maximum results (default: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "facts": [...]
  }
}
```

### POST /api/v1/memory/facts
Create a new memory fact

**Query Parameters:**
- `category` (required): Category (preference, fact, skill, goal)
- `content` (required): Fact content
- `confidence` (optional): Confidence level (0-1)
- `conversation_id` (optional): Source conversation

### DELETE /api/v1/memory/facts/{id}
Delete a memory fact

### POST /api/v1/memory/search
Search memories semantically

**Request Body:**
```json
{
  "query": "...",
  "limit": 10
}