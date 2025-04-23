
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

## Search API

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
    ]
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

### Tweets Analysis
- **Endpoint**: `/analysis/tweets`
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
    "query": "السعودية الأرجنتين",
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
    ],
    "highlights": {
      "earliest": {
        "id": "tweet-100",
        "text": "بدأت مباراة السعودية والأرجنتين للتو",
        "date": "2022-11-22T12:00:00Z"
      },
      "mostLiked": {
        "id": "tweet-200",
        "text": "السعودية تحقق المفاجأة وتهزم الأرجنتين 2-1",
        "likes": 125000
      }
    }
  }
}
```

### Influencers Analysis
- **Endpoint**: `/analysis/influencers`
- **Method**: `GET`
- **Parameters**:
  - `query`: Search query
  - `from`: Start date
  - `to`: End date
- **Response**:
```json
{
  "success": true,
  "data": {
    "query": "السعودية الأرجنتين",
    "influencers": [
      {
        "id": "user-123",
        "name": "محمد السعيد",
        "username": "@msaeed",
        "profileImage": "https://example.com/profile.jpg",
        "verified": true,
        "followers": "1.2M",
        "engagement": "5.4%",
        "tweets": 12,
        "topTweet": {
          "id": "tweet-456",
          "text": "ألف مبروك للمنتخب السعودي على هذا الإنجاز العظيم",
          "likes": 45000
        }
      }
      // More influencers...
    ]
  }
}
```

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
