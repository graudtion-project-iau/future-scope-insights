# Future Vision API Documentation

## Base URL
```
https://Futvi.com/api
```

## Authentication
Authentication is done via OTP (One-Time Password) sent to mobile numbers.

### Login Request
- **Endpoint**: `/auth/login`
- **Method**: `POST`
- **Body**:
```json
{
  "phoneNumber": "05xxxxxxxx"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "requestId": "req-123456"
  }
}
```

### Verify OTP
- **Endpoint**: `/auth/verify`
- **Method**: `POST`
- **Body**:
```json
{
  "requestId": "req-123456",
  "phoneNumber": "05xxxxxxxx",
  "otp": "1234"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-123",
      "phoneNumber": "05xxxxxxxx",
      "name": "User Name"
    }
  }
}
```

## Multi-Stage Search Process

The search process is divided into three stages to provide real-time feedback and updates:

### Stage 1: Initial Search
- **Endpoint**: `/search`
- **Method**: `POST`
- **Body**:
```json
{
  "query": "موسم الرياض",
  "filters": {
    "from": "2023-01-01",
    "to": "2023-12-31",
    "source": ["twitter", "news"],
    "language": "ar"
  }
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Search initiated",
  "data": {
    "searchId": "search-123456",
    "estimatedTime": 15, // seconds
    "status": "searching"
  }
}
```

### Stage 2: Check Search Status
- **Endpoint**: `/search/status`
- **Method**: `GET`
- **Parameters**:
  - `searchId`: ID of the search operation
- **Response**:
```json
{
  "success": true,
  "data": {
    "searchId": "search-123456",
    "status": "analyzing", // "searching", "analyzing", "preparing", "completed", "error"
    "progress": 45, // percentage (0-100)
    "message": "Analyzing sentiment and trends",
    "estimatedCompletion": 10, // seconds remaining
    "tweetsFound": 5243,
    "error": null // present only if status is "error"
  }
}
```

### Stage 3: Retrieve Analysis Results
- **Endpoint**: `/analysis/overview`
- **Method**: `GET`
- **Parameters**:
  - `searchId`: ID of the search operation
- **Response**:
```json
{
  "success": true,
  "data": {
    "query": "موسم الرياض",
    "total": 35842,
    "sentiment": {
      "positive": 72,
      "neutral": 21,
      "negative": 7
    },
    "kpis": [
      { "name": "متوسط المشاعر", "value": "+0.78", "change": 15 },
      { "name": "عدد الإشارات", "value": "35,842", "change": 25 },
      { "name": "الموقع الرئيسي", "value": "الرياض" },
      { "name": "عدد المؤثرين", "value": "47", "change": 12 }
    ],
    "timeline": [
      { "date": "أسبوع 1", "positive": 5200, "neutral": 1800, "negative": 700 },
      // More timeline data...
    ],
    "locations": [
      { "name": "الرياض", "value": 68 },
      { "name": "جدة", "value": 12 },
      // More location data...
    ],
    "keywords": [
      { "keyword": "فعاليات", "count": 4280, "trend": "increase" },
      { "keyword": "حفلات", "count": 3750, "trend": "increase" },
      // More keywords...
    ],
    "influencers": [
      { 
        "name": "هيئة الترفيه", 
        "followers": "2.4M", 
        "engagement": "6.7%", 
        "image": "https://example.com/image.jpg" 
      },
      // More influencers...
    ],
    "hashtags": [
      { "tag": "#موسم_الرياض", "count": 18500, "trend": "increase" },
      { "tag": "#RiyadhSeason", "count": 12300, "trend": "increase" },
      // More hashtags...
    ],
    "lastUpdate": "15:30 - 26 أبريل 2025"
  }
}
```

### Cancel Search
- **Endpoint**: `/search/cancel`
- **Method**: `POST`
- **Body**:
```json
{
  "searchId": "search-123456"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Search cancelled successfully",
  "data": {
    "searchId": "search-123456",
    "status": "cancelled"
  }
}
```

## Standard Search API

### Search Query
- **Endpoint**: `/search`
- **Method**: `GET`
- **Parameters**:
  - `q`: Search query (required)
  - `from`: Start date (YYYY-MM-DD)
  - `to`: End date (YYYY-MM-DD)
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 20)
  - `sort`: Sort order (options: recent, popular, relevant)
  - `filter`: Filter type (options: tweets, users, media)
- **Response**:
```json
{
  "success": true,
  "data": {
    "query": "السعودية الأرجنتين",
    "total": 15423,
    "page": 1,
    "pages": 772,
    "results": [
      {
        "id": "tweet-123",
        "text": "مباراة تاريخية للمنتخب السعودي ضد الأرجنتين",
        "user": {
          "id": "user-456",
          "name": "محمد السعيد",
          "username": "@msaeed",
          "profileImage": "https://example.com/profile.jpg",
          "verified": true,
          "followers": 125000
        },
        "date": "2022-11-22T13:45:28Z",
        "likes": 5420,
        "retweets": 1230,
        "quotes": 342,
        "replies": 248,
        "sentiment": "positive",
        "media": [
          {
            "type": "image",
            "url": "https://example.com/image.jpg"
          }
        ]
      }
      // More tweets...
    ],
    "analysis": {
      "sentiment": {
        "positive": 67,
        "neutral": 23,
        "negative": 10
      },
      "timeline": [
        { "date": "2022-11-22T12:00:00Z", "count": 1245 },
        { "date": "2022-11-22T13:00:00Z", "count": 5430 }
        // More timeline data...
      ]
    }
  }
}
```

### Search Suggestions
- **Endpoint**: `/search/suggestions`
- **Method**: `GET`
- **Parameters**:
  - `q`: Partial search query
- **Response**:
```json
{
  "success": true,
  "data": {
    "suggestions": [
      { "text": "السعودية الأرجنتين", "score": 0.95 },
      { "text": "السعودية في كأس العالم", "score": 0.82 },
      { "text": "السعودية والارجنتين ميسي", "score": 0.78 }
    ]
  }
}
```

### Trending Topics
- **Endpoint**: `/search/trending`
- **Method**: `GET`
- **Parameters**:
  - `category`: Category filter (optional)
  - `limit`: Number of trending topics (default: 10)
- **Response**:
```json
{
  "success": true,
  "data": {
    "trends": [
      { "tag": "السعودية_الأرجنتين", "count": 204500, "category": "sports" },
      { "tag": "كأس_العالم_2022", "count": 187300, "category": "sports" },
      { "tag": "انفجار_الخبر", "count": 45600, "category": "news" }
    ]
  }
}
```

## Analysis API

### Overview Analysis
- **Endpoint**: `/analysis/overview`
- **Method**: `GET`
- **Parameters**:
  - `query`: Search query
  - `from`: Start date
  - `to`: End date
  - `searchId`: ID from a multi-stage search (optional)
- **Response**:
```json
{
  "success": true,
  "data": {
    "query": "السعودية الأرجنتين",
    "total": 15423,
    "sentiment": {
      "positive": 67,
      "neutral": 23,
      "negative": 10
    },
    "kpis": [
      { "name": "متوسط المشاعر", "value": "+0.67", "change": 12 },
      { "name": "عدد الإشارات", "value": "1,200", "change": 5 },
      { "name": "الموقع الرئيسي", "value": "الرياض" },
      { "name": "عدد المؤثرين", "value": "24", "change": -3 }
    ],
    "timeline": [
      { "date": "2022-11-22T12:00:00Z", "positive": 4000, "neutral": 2400, "negative": 1200 },
      // More timeline data...
    ],
    "locations": [
      { "name": "الرياض", "value": 45 },
      { "name": "العلا", "value": 25 },
      { "name": "جدة", "value": 20 },
      { "name": "أخرى", "value": 10 }
    ],
    "keywords": [
      { "keyword": "ضيافة", "count": 240, "trend": "increase" },
      { "keyword": "تراث", "count": 185, "trend": "increase" },
      // More keywords...
    ],
    "influencers": [
      { 
        "name": "محمد السعيد", 
        "followers": "1.2M", 
        "engagement": "5.4%", 
        "image": "https://randomuser.me/api/portraits/men/1.jpg" 
      },
      // More influencers...
    ],
    "hashtags": [
      { "tag": "#السعودية_الأرجنتين", "count": 18500, "trend": "increase" },
      { "tag": "#WorldCup2022", "count": 12300, "trend": "increase" },
      // More hashtags...
    ],
    "lastUpdate": "13:45 - 22 نوفمبر 2022"
  }
}
```

### Sentiment Analysis
- **Endpoint**: `/analysis/sentiment`
- **Method**: `GET`
- **Parameters**:
  - `query`: Search query
  - `from`: Start date
  - `to`: End date
  - `searchId`: ID from a multi-stage search (optional)
- **Response**:
```json
{
  "success": true,
  "data": {
    "query": "السعودية الأرجنتين",
    "distribution": [
      { "name": "إيجابي", "value": 67 },
      { "name": "محايد", "value": 23 },
      { "name": "سلبي", "value": 10 }
    ],
    "timeline": [
      { "date": "2022-11-22T12:00:00Z", "positive": 4000, "neutral": 2400, "negative": 1200 },
      // More timeline data...
    ],
    "keyPhrases": {
      "positive": ["فوز تاريخي", "إنجاز كبير", "أداء رائع"],
      "neutral": ["مباراة كأس العالم", "تشكيلة المنتخب", "الهدف الأول"],
      "negative": ["هدف الارجنتين", "فرصة ضائعة", "خسارة محتملة"]
    }
  }
}
```

### Export Analysis
- **Endpoint**: `/analysis/export`
- **Method**: `GET`
- **Parameters**:
  - `searchId`: ID of the search operation
  - `format`: Export format (pdf, excel, json)
- **Response**: Binary file download

## Tweet API

### List Tweets
- **Endpoint**: `/tweets`
- **Method**: `GET`
- **Parameters**:
  - `query`: Search query
  - `from`: Start date
  - `to`: End date
  - `sort`: Sort order (recent, popular)
  - `filter`: Filter type (media, verified)
  - `page`: Page number
  - `limit`: Results per page
- **Response**:
```json
{
  "success": true,
  "data": {
    "total": 15423,
    "page": 1,
    "pages": 772,
    "tweets": [
      {
        "id": "tweet-123",
        "text": "مباراة تاريخية للمنتخب السعودي ضد الأرجنتين",
        "user": {
          "id": "user-456",
          "name": "محمد السعيد",
          "username": "@msaeed",
          "profileImage": "https://example.com/profile.jpg",
          "verified": true,
          "followers": 125000
        },
        "date": "2022-11-22T13:45:28Z",
        "likes": 5420,
        "retweets": 1230,
        "quotes": 342,
        "replies": 248,
        "sentiment": "positive",
        "media": [
          {
            "type": "image",
            "url": "https://example.com/image.jpg"
          }
        ]
      }
      // More tweets...
    ]
  }
}
```

### Tweet Details
- **Endpoint**: `/tweets/{id}`
- **Method**: `GET`
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "tweet-123",
    "text": "مباراة تاريخية للمنتخب السعودي ضد الأرجنتين",
    "user": {
      "id": "user-456",
      "name": "محمد السعيد",
      "username": "@msaeed",
      "profileImage": "https://example.com/profile.jpg",
      "verified": true,
      "followers": 125000
    },
    "date": "2022-11-22T13:45:28Z",
    "likes": 5420,
    "retweets": 1230,
    "quotes": 342,
    "replies": 248,
    "sentiment": "positive",
    "media": [
      {
        "type": "image",
        "url": "https://example.com/image.jpg"
      }
    ],
    "context": {
      "conversation": [
        // Related tweets in conversation
      ],
      "related": [
        // Related tweets by topic
      ]
    }
  }
}
```

### Popular Tweets
- **Endpoint**: `/tweets/popular`
- **Method**: `GET`
- **Parameters**:
  - `query`: Search query
  - `from`: Start date
  - `to`: End date
  - `limit`: Number of tweets (default: 10)
- **Response**: Same structure as List Tweets

### Earliest Tweets
- **Endpoint**: `/tweets/earliest`
- **Method**: `GET`
- **Parameters**:
  - `query`: Search query
  - `limit`: Number of tweets (default: 10)
- **Response**: Same structure as List Tweets

### Latest Tweets
- **Endpoint**: `/tweets/latest`
- **Method**: `GET`
- **Parameters**:
  - `query`: Search query
  - `limit`: Number of tweets (default: 10)
- **Response**: Same structure as List Tweets

## User API

### User Profile
- **Endpoint**: `/user/profile`
- **Method**: `GET`
- **Headers**: Authorization token required
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "phoneNumber": "05xxxxxxxx",
    "name": "User Name",
    "email": "user@example.com",
    "preferences": {
      "language": "ar",
      "notifications": {
        "email": true,
        "sms": false,
        "whatsapp": true
      }
    },
    "savedSearches": [
      { "id": "saved-1", "query": "السعودية الأرجنتين", "created": "2022-11-25T10:30:00Z" }
    ]
  }
}
```

### User Interests
- **Endpoint**: `/user/interests`
- **Method**: `GET`
- **Headers**: Authorization token required
- **Response**:
```json
{
  "success": true,
  "data": {
    "interests": ["tourism", "sports", "economy"],
    "keywords": ["keyword1", "keyword2"]
  }
}
```

### Update User Interests
- **Endpoint**: `/user/interests`
- **Method**: `PUT`
- **Headers**: Authorization token required
- **Body**:
```json
{
  "interests": ["tourism", "sports", "economy"],
  "keywords": ["keyword1", "keyword2"]
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Interests updated successfully",
  "data": {
    "interests": ["tourism", "sports", "economy"],
    "keywords": ["keyword1", "keyword2"]
  }
}
```

### Update User Preferences
- **Endpoint**: `/user/preferences`
- **Method**: `PUT`
- **Headers**: Authorization token required
- **Body**:
```json
{
  "notifications": {
    "email": true,
    "sms": false,
    "whatsapp": true
  },
  "frequency": "daily"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "data": {
    "notifications": {
      "email": true,
      "sms": false,
      "whatsapp": true
    },
    "frequency": "daily"
  }
}
```

## Future Vision Agent API

### Generate Analysis Report
- **Endpoint**: `/agent/analyze`
- **Method**: `POST`
- **Body**:
```json
{
  "searchId": "search-123456",
  "depth": "standard", // "brief", "standard", "detailed"
  "focus": ["sentiment", "influencers", "trends"],
  "language": "ar"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "reportId": "report-789",
    "searchId": "search-123456",
    "generationStatus": "in_progress", // "in_progress", "completed", "failed"
    "estimatedCompletion": 30 // seconds
  }
}
```

### Get Analysis Report
- **Endpoint**: `/agent/report/{reportId}`
- **Method**: `GET`
- **Response**:
```json
{
  "success": true,
  "data": {
    "reportId": "report-789",
    "searchId": "search-123456",
    "status": "completed",
    "title": "تحليل موسم الرياض",
    "summary": "تحليل شامل للتفاعلات على وسائل التواصل الاجتماعي حول موسم الرياض...",
    "sections": [
      {
        "title": "الرأي العام",
        "content": "يظهر التحليل توجهاً إيجابياً نحو فعاليات موسم الرياض حيث بلغت نسبة المشاعر الإيجابية 72%...",
        "visualKey": "sentiment_pie"
      },
      {
        "title": "المؤثرون الرئيسيون",
        "content": "كان للحسابات الرسمية مثل هيئة الترفيه وحساب موسم الرياض التأثير الأكبر...",
        "visualKey": "influencers_table"
      }
      // More sections...
    ],
    "recommendations": [
      "زيادة التواصل حول موضوع تذاكر الفعاليات لمعالجة المخاوف من الأسعار المرتفعة",
      "التركيز على قصص النجاح من الفعاليات السابقة"
      // More recommendations...
    ],
    "createdAt": "2025-04-26T16:30:00Z"
  }
}
```

### Agent Query
- **Endpoint**: `/agent/query`
- **Method**: `POST`
- **Body**:
```json
{
  "searchId": "search-123456",
  "query": "ما هي أبرز الفعاليات التي حظيت بردود فعل إيجابية؟",
  "context": "trends"
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "answer": "بناءً على تحليل البيانات، فإن أبرز الفعاليات التي حظيت بردود فعل إيجابية هي: 1) الحفلات الموسيقية في بوليفارد رياض حيث بلغت نسبة المشاعر الإيجابية 85%، 2) عروض المسرح العالمي بنسبة 78% إيجابية، 3) فعاليات الألعاب والترفيه العائلية بنسبة 72% إيجابية.",
    "relatedData": {
      "visualType": "bar_chart",
      "data": [
        { "name": "الحفلات الموسيقية", "value": 85 },
        { "name": "عروض المسرح", "value": 78 },
        { "name": "فعاليات عائلية", "value": 72 }
      ]
    },
    "relatedQueries": [
      "ما هي أكثر الفعاليات التي واجهت انتقادات؟",
      "ما هي اقتراحات الجمهور لتحسين الفعاليات؟"
    ]
  }
}
```
