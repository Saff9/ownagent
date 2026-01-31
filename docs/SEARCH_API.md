# Search API

## Endpoints

### POST /api/v1/search
Perform a web search

**Query Parameters:**
- `query` (required): Search query string
- `provider` (optional): Search provider (serpapi, brave, duckduckgo)
- `num_results` (optional): Number of results (1-50)
- `search_type` (optional): Type of search (general, news, images)
- `use_cache` (optional): Use cached results (default: true)

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [...],
    "query": "...",
    "total_results": 10,
    "search_time": 1.23,
    "provider": "duckduckgo",
    "cached": false
  }
}
```

### GET /api/v1/search/providers
Get available search providers

### GET /api/v1/search/history
Get search history (cache-based)

### POST /api/v1/search/cache/clear
Clear search cache

### GET /api/v1/search/cache/stats
Get cache statistics