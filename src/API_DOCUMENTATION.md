
# API Documentation

## Overview

This document provides information about the API endpoints used in the Social Media Analysis Platform. The platform uses a RESTful API to retrieve analysis data, search results, and other information.

## Base URL

```
https://api.futuresco.pe/v1
```

## Authentication

All API requests require an authentication token. Add the token to the Authorization header:

```
Authorization: Bearer YOUR_API_TOKEN
```

## Endpoints

### 1. Search Analysis Overview

Retrieves a comprehensive overview of social media analysis for a specific query.

**Endpoint:** `/analysis/overview`

**Method:** GET

**Parameters:**
- `query` (required): The search term or hashtag to analyze

**Example Request:**
```
GET /analysis/overview?query=السعودية_الأرجنتين
```

**Example Response:**
```json
{
  "data": {
    "query": "السعودية_الأرجنتين",
    "total": 15423,
    "sentiment": {
      "positive": 67,
      "neutral": 23,
      "negative": 10
    },
    "kpis": [
      { "name": "متوسط المشاعر", "value": "+0.67", "change": 12 },
      { "name": "عدد الإشارات", "value": "15,423", "change": 5 },
      { "name": "الموقع الرئيسي", "value": "الرياض" },
      { "name": "عدد المؤثرين", "value": "24", "change": -3 }
    ],
    "timeline": [
      { "date": "1 يناير", "إيجابي": 4000, "محايد": 2400, "سلبي": 1200 },
      { "date": "2 يناير", "إيجابي": 3000, "محايد": 1398, "سلبي": 2000 }
    ],
    "locations": [
      { "name": "الرياض", "value": 45 },
      { "name": "جدة", "value": 20 }
    ],
    "keywords": [
      { "keyword": "كأس العالم", "count": 240, "trend": "increase" },
      { "keyword": "المنتخب السعودي", "count": 185, "trend": "increase" }
    ],
    "influencers": [
      { "name": "محمد السعيد", "followers": "1.2M", "engagement": "5.4%", "image": "https://randomuser.me/api/portraits/men/1.jpg" }
    ],
    "highlightTweets": {
      "earliest": {
        "id": "tweet-1",
        "text": "مباراة تاريخية للمنتخب السعودي!",
        "user": {
          "name": "أحمد",
          "username": "@ahmed",
          "profileImage": "https://randomuser.me/api/portraits/men/1.jpg",
          "verified": true
        },
        "date": "2022-11-22T13:45:28Z",
        "likes": 54200
      },
      "mostLiked": {
        "id": "tweet-2",
        "text": "فخورين بالمنتخب!",
        "user": {
          "name": "خالد",
          "username": "@khalid",
          "profileImage": "https://randomuser.me/api/portraits/men/2.jpg",
          "verified": true
        },
        "date": "2022-11-22T14:30:12Z",
        "likes": 98700
      }
    }
  }
}
```

### 2. Get Tweets

Retrieves tweets related to a specific query with filtering options.

**Endpoint:** `/analysis/tweets`

**Method:** GET

**Parameters:**
- `query` (required): The search term or hashtag
- `page`: Page number for pagination (default: 1)
- `sort`: Sort order - 'recent', 'popular', or 'relevant' (default: 'recent')
- `timeRange`: Time range - '24h', '7d', '30d', 'all' (default: '24h')
- `hasMedia`: Filter tweets with media only (default: false)
- `verifiedOnly`: Filter tweets from verified accounts only (default: false)
- `sentiment`: Filter by sentiment - 'positive', 'neutral', 'negative' (can include multiple)

**Example Request:**
```
GET /analysis/tweets?query=السعودية_الأرجنتين&page=1&sort=popular&timeRange=7d&sentiment=positive,neutral
```

**Example Response:**
```json
{
  "data": {
    "total": 15423,
    "page": 1,
    "pages": 772,
    "tweets": [
      {
        "id": "tweet-1",
        "text": "مباراة تاريخية للمنتخب السعودي ضد الأرجنتين!",
        "user": {
          "id": "user-1",
          "name": "محمد السعيد",
          "username": "@msaeed",
          "profileImage": "https://randomuser.me/api/portraits/men/1.jpg",
          "verified": true,
          "followers": 1200000
        },
        "date": "2022-11-22T13:45:28Z",
        "likes": 54200,
        "retweets": 12300,
        "quotes": 3420,
        "replies": 2480,
        "sentiment": "positive"
      }
    ]
  }
}
```

### 3. Get Search Suggestions

Retrieves search suggestions based on partial input.

**Endpoint:** `/search/suggestions`

**Method:** GET

**Parameters:**
- `q`: Partial search query

**Example Request:**
```
GET /search/suggestions?q=الرياض
```

**Example Response:**
```json
{
  "suggestions": [
    { "text": "موسم الرياض", "score": 0.95 },
    { "text": "الرياض الخضراء", "score": 0.88 },
    { "text": "مهرجان الرياض للتسوق", "score": 0.75 }
  ]
}
```

## Using the API in the Application

### Loading Data in the Dashboard

The dashboard uses multiple API calls to populate different sections:

1. **Initial Load**: When a user searches for a query, the application calls `/analysis/overview` to get the general statistics and charts data.

2. **Tweet Feed**: The application calls `/analysis/tweets` to get the tweets related to the query.

3. **As-You-Type Suggestions**: When typing in the search box, the application calls `/search/suggestions` with a 300ms debounce to provide search suggestions.

### Charts Implementation

The application uses the Recharts library to visualize data from the API. The data flow is as follows:

1. API call returns formatted data
2. Data is processed and transformed if needed
3. Chart components receive the data as props
4. Charts render with appropriate colors, legends, and tooltips

Example for sentiment timeline chart:
```jsx
<LineChart 
  data={overview.timeline} 
  lines={[
    { dataKey: 'إيجابي', color: '#4CAF50', name: 'إيجابي' },
    { dataKey: 'محايد', color: '#FFC107', name: 'محايد' },
    { dataKey: 'سلبي', color: '#F44336', name: 'سلبي' },
  ]}
  xAxisDataKey="date"
/>
```

## Notes

- The API uses JWT tokens for authentication which expire after 24 hours
- Rate limiting is set to 100 requests per minute per API key
- Large result sets are paginated with a default page size of 20
- Arabic language queries are fully supported with proper UTF-8 encoding
- For production use, consider implementing caching strategies to reduce API calls
- Error responses follow standard HTTP status codes with descriptive messages
- All timestamps are in ISO 8601 format and UTC timezone
