
# Future Vision API Documentation

## Overview
This document provides detailed information about the API endpoints for the Future Vision platform, which is used for analyzing social media content, particularly focusing on Twitter data analysis, sentiment analysis, and trend monitoring.

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
    ],
    "highlightTweets": {
      "earliest": {
        "id": "tweet-123",
        "text": "بدأت مباراة السعودية والأرجنتين للتو",
        "user": {
          "id": "user-456",
          "name": "محمد السعيد",
          "username": "@msaeed",
          "profileImage": "https://example.com/profile.jpg",
          "verified": true,
          "followers": 125000
        },
        "date": "2022-11-22T12:00:00Z",
        "likes": 1420,
        "retweets": 230,
        "quotes": 42,
        "replies": 48,
        "sentiment": "neutral"
      },
      "mostLiked": {
        "id": "tweet-456",
        "text": "السعودية تحقق المفاجأة وتهزم الأرجنتين 2-1",
        "user": {
          "id": "user-789",
          "name": "أحمد الشمري",
          "username": "@ahmed",
          "profileImage": "https://example.com/profile2.jpg",
          "verified": true,
          "followers": 780000
        },
        "date": "2022-11-22T14:30:00Z",
        "likes": 125000,
        "retweets": 54230,
        "quotes": 3342,
        "replies": 2748,
        "sentiment": "positive"
      }
    }
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
    },
    "topTweets": {
      "positive": [
        {
          "id": "tweet-123",
          "text": "مباراة تاريخية للمنتخب السعودي!",
          "user": {
            "id": "user-456",
            "name": "محمد السعيد",
            "username": "@msaeed",
            "profileImage": "https://example.com/profile.jpg",
            "verified": true,
            "followers": 125000
          },
          "date": "2022-11-22T13:45:28Z",
          "likes": 54200,
          "retweets": 12300,
          "sentiment": "positive"
        }
      ],
      "neutral": [
        // Similar structure for neutral tweets
      ],
      "negative": [
        // Similar structure for negative tweets
      ]
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
  - `sentiment`: Comma-separated list of sentiment values (positive,neutral,negative)
  - `hasMedia`: Boolean to filter tweets with media
  - `verifiedOnly`: Boolean to filter only verified accounts
  - `timeRange`: Time range (24h, 7d, 30d, custom)
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

### Timeline Analysis
- **Endpoint**: `/analysis/timeline`
- **Method**: `GET`
- **Parameters**:
  - `query`: Search query
  - `from`: Start date
  - `to`: End date
  - `interval`: Time interval (hour, day, week)
- **Response**:
```json
{
  "success": true,
  "data": {
    "query": "السعودية الأرجنتين",
    "timeline": [
      {
        "date": "2022-11-22T12:00:00Z",
        "total": 7600,
        "positive": 4000,
        "neutral": 2400,
        "negative": 1200
      },
      {
        "date": "2022-11-22T13:00:00Z",
        "total": 9306,
        "positive": 3000,
        "neutral": 1398,
        "negative": 2000
      }
      // More timeline data...
    ],
    "peaks": [
      {
        "date": "2022-11-22T14:00:00Z",
        "count": 15430,
        "triggerTweet": {
          "id": "tweet-789",
          "text": "السعودية تسجل الهدف الثاني!",
          "user": {
            "name": "أحمد الشمري",
            "username": "@ahmed",
            "verified": true
          },
          "likes": 42300
        }
      }
    ]
  }
}
```

### Location Analysis
- **Endpoint**: `/analysis/location`
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
    "locations": [
      {
        "name": "الرياض",
        "value": 45,
        "sentiment": {
          "positive": 70,
          "neutral": 20,
          "negative": 10
        }
      },
      {
        "name": "العلا",
        "value": 25,
        "sentiment": {
          "positive": 65,
          "neutral": 25,
          "negative": 10
        }
      },
      {
        "name": "جدة",
        "value": 20,
        "sentiment": {
          "positive": 60,
          "neutral": 30,
          "negative": 10
        }
      },
      {
        "name": "أخرى",
        "value": 10,
        "sentiment": {
          "positive": 50,
          "neutral": 30,
          "negative": 20
        }
      }
    ],
    "geoData": {
      // GeoJSON format data for map visualization
    }
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

### Save Search
- **Endpoint**: `/user/saved`
- **Method**: `POST`
- **Headers**: Authorization token required
- **Body**:
```json
{
  "query": "السعودية الأرجنتين",
  "name": "مباراة السعودية والأرجنتين"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Search saved successfully",
  "data": {
    "id": "saved-123",
    "query": "السعودية الأرجنتين",
    "name": "مباراة السعودية والأرجنتين",
    "created": "2023-05-15T14:30:00Z"
  }
}
```

### Get Saved Searches
- **Endpoint**: `/user/saved`
- **Method**: `GET`
- **Headers**: Authorization token required
- **Response**:
```json
{
  "success": true,
  "data": {
    "saved": [
      {
        "id": "saved-123",
        "query": "السعودية الأرجنتين",
        "name": "مباراة السعودية والأرجنتين",
        "created": "2023-05-15T14:30:00Z"
      },
      {
        "id": "saved-124",
        "query": "انفجار الخبر",
        "name": "حادث الخبر",
        "created": "2023-06-20T09:15:00Z"
      }
    ]
  }
}
```

### Delete Saved Search
- **Endpoint**: `/user/saved/{id}`
- **Method**: `DELETE`
- **Headers**: Authorization token required
- **Response**:
```json
{
  "success": true,
  "message": "Search deleted successfully"
}
```

## Monitoring API

### Get Monitoring Topics
- **Endpoint**: `/monitoring/topics`
- **Method**: `GET`
- **Headers**: Authorization token required
- **Response**:
```json
{
  "success": true,
  "data": {
    "topics": [
      {
        "id": "topic-123",
        "name": "السعودية في كأس العالم",
        "keywords": ["المنتخب السعودي", "كأس العالم", "السعودية الأرجنتين"],
        "active": true,
        "createdAt": "2023-01-15T10:30:00Z"
      },
      {
        "id": "topic-124",
        "name": "موسم الرياض",
        "keywords": ["موسم الرياض", "بوليفارد", "فعاليات الرياض"],
        "active": true,
        "createdAt": "2023-02-20T14:45:00Z"
      }
    ]
  }
}
```

### Create Monitoring Topic
- **Endpoint**: `/monitoring/topics`
- **Method**: `POST`
- **Headers**: Authorization token required
- **Body**:
```json
{
  "name": "العلا السياحية",
  "keywords": ["العلا", "سياحة العلا", "وجهة سياحية"],
  "active": true
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Topic created successfully",
  "data": {
    "id": "topic-125",
    "name": "العلا السياحية",
    "keywords": ["العلا", "سياحة العلا", "وجهة سياحية"],
    "active": true,
    "createdAt": "2023-06-28T09:00:00Z"
  }
}
```

### Update Monitoring Topic
- **Endpoint**: `/monitoring/topics/{id}`
- **Method**: `PUT`
- **Headers**: Authorization token required
- **Body**:
```json
{
  "name": "العلا السياحية - تحديث",
  "keywords": ["العلا", "سياحة العلا", "وجهة سياحية", "العلا الشتوية"],
  "active": true
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Topic updated successfully",
  "data": {
    "id": "topic-125",
    "name": "العلا السياحية - تحديث",
    "keywords": ["العلا", "سياحة العلا", "وجهة سياحية", "العلا الشتوية"],
    "active": true,
    "updatedAt": "2023-06-29T10:15:00Z"
  }
}
```

### Delete Monitoring Topic
- **Endpoint**: `/monitoring/topics/{id}`
- **Method**: `DELETE`
- **Headers**: Authorization token required
- **Response**:
```json
{
  "success": true,
  "message": "Topic deleted successfully"
}
```

### Configure Alert Settings
- **Endpoint**: `/monitoring/configure`
- **Method**: `POST`
- **Headers**: Authorization token required
- **Body**:
```json
{
  "topics": ["topic-123", "topic-125"],
  "alertThreshold": "medium",
  "channels": {
    "email": true,
    "sms": false,
    "whatsapp": true
  },
  "frequency": "instant"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Alert settings configured successfully",
  "data": {
    "configId": "config-456",
    "topics": ["topic-123", "topic-125"],
    "alertThreshold": "medium",
    "channels": {
      "email": true,
      "sms": false,
      "whatsapp": true
    },
    "frequency": "instant"
  }
}
```

### Get Alert Settings
- **Endpoint**: `/monitoring/configure`
- **Method**: `GET`
- **Headers**: Authorization token required
- **Response**:
```json
{
  "success": true,
  "data": {
    "configId": "config-456",
    "topics": ["topic-123", "topic-125"],
    "alertThreshold": "medium",
    "channels": {
      "email": true,
      "sms": false,
      "whatsapp": true
    },
    "frequency": "instant"
  }
}
```

### Get Recent Alerts
- **Endpoint**: `/monitoring/alerts`
- **Method**: `GET`
- **Headers**: Authorization token required
- **Parameters**:
  - `page`: Page number
  - `limit`: Results per page
- **Response**:
```json
{
  "success": true,
  "data": {
    "alerts": [
      {
        "id": "alert-789",
        "topic": {
          "id": "topic-123",
          "name": "السعودية في كأس العالم"
        },
        "trigger": "Spike in activity",
        "importance": "high",
        "createdAt": "2023-06-30T08:45:00Z",
        "message": "ارتفاع مفاجئ في نشاط الهاشتاج #السعودية_الأرجنتين",
        "detail": "تم تسجيل أكثر من 5000 تغريدة في آخر 15 دقيقة",
        "relatedTweet": {
          "id": "tweet-456",
          "text": "خبر عاجل: السعودية تسجل هدفين وتتقدم على الأرجنتين!",
          "user": {
            "name": "قناة الأخبار العربية",
            "verified": true
          }
        }
      }
    ],
    "page": 1,
    "pages": 5,
    "total": 42
  }
}
```

### Get Alert Details
- **Endpoint**: `/monitoring/alerts/{id}`
- **Method**: `GET`
- **Headers**: Authorization token required
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "alert-789",
    "topic": {
      "id": "topic-123",
      "name": "السعودية في كأس العالم"
    },
    "trigger": "Spike in activity",
    "importance": "high",
    "createdAt": "2023-06-30T08:45:00Z",
    "message": "ارتفاع مفاجئ في نشاط الهاشتاج #السعودية_الأرجنتين",
    "detail": "تم تسجيل أكثر من 5000 تغريدة في آخر 15 دقيقة",
    "relatedTweet": {
      "id": "tweet-456",
      "text": "خبر عاجل: السعودية تسجل هدفين وتتقدم على الأرجنتين!",
      "user": {
        "name": "قناة الأخبار العربية",
        "verified": true
      }
    },
    "timeline": [
      {
        "time": "08:30",
        "count": 500
      },
      {
        "time": "08:35",
        "count": 800
      },
      {
        "time": "08:40",
        "count": 2200
      },
      {
        "time": "08:45",
        "count": 5100
      }
    ],
    "topTweets": [
      // Sample tweets that contributed to the alert
    ],
    "sentimentShift": {
      "before": {
        "positive": 60,
        "neutral": 30,
        "negative": 10
      },
      "after": {
        "positive": 85,
        "neutral": 10,
        "negative": 5
      }
    }
  }
}
```

### Get Monitoring Events
- **Endpoint**: `/monitoring/events`
- **Method**: `GET`
- **Headers**: Authorization token required
- **Parameters**:
  - `from`: Start date
  - `to`: End date
  - `topic`: Topic ID (optional)
- **Response**:
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "event-123",
        "topic": {
          "id": "topic-123",
          "name": "السعودية في كأس العالم"
        },
        "title": "مباراة السعودية والأرجنتين",
        "startDate": "2022-11-22T12:00:00Z",
        "endDate": "2022-11-22T14:00:00Z",
        "peakTime": "2022-11-22T13:45:00Z",
        "tweetCount": 15423,
        "sentiment": {
          "positive": 67,
          "neutral": 23,
          "negative": 10
        },
        "keyMoments": [
          {
            "time": "2022-11-22T12:15:00Z",
            "title": "هدف الأرجنتين الأول",
            "tweetCount": 2100
          },
          {
            "time": "2022-11-22T13:10:00Z",
            "title": "هدف السعودية الأول",
            "tweetCount": 8500
          },
          {
            "time": "2022-11-22T13:35:00Z",
            "title": "هدف السعودية الثاني",
            "tweetCount": 12300
          }
        ]
      }
    ],
    "total": 10
  }
}
```

## Reports API

### Get Reports List
- **Endpoint**: `/reports`
- **Method**: `GET`
- **Headers**: Authorization token required
- **Parameters**:
  - `type`: Report type
  - `limit`: Number of results (default: 10)
  - `page`: Page number (default: 1)
- **Response**:
```json
{
  "success": true,
  "data": {
    "reports": [
      {
        "id": "report-123",
        "title": "تحليل مباراة السعودية والأرجنتين",
        "description": "تقرير شامل عن تفاعل المستخدمين مع مباراة السعودية والأرجنتين في كأس العالم 2022",
        "createdAt": "2022-11-23T10:30:00Z",
        "type": "event",
        "status": "completed"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPages": 5,
      "totalReports": 45
    }
  }
}
```

### Get Report Details
- **Endpoint**: `/reports/{reportId}`
- **Method**: `GET`
- **Headers**: Authorization token required
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "report-123",
    "title": "تحليل مباراة السعودية والأرجنتين",
    "description": "تقرير شامل عن تفاعل المستخدمين مع مباراة السعودية والأرجنتين في كأس العالم 2022",
    "createdAt": "2022-11-23T10:30:00Z",
    "type": "event",
    "status": "completed",
    "query": "السعودية الأرجنتين",
    "period": {
      "start": "2022-11-22T00:00:00Z",
      "end": "2022-11-23T00:00:00Z"
    },
    "summary": "شهدت مباراة السعودية والأرجنتين تفاعلاً غير مسبوق على منصات التواصل الاجتماعي، حيث تم رصد أكثر من 15 ألف تغريدة خلال فترة المباراة...",
    "metrics": {
      "totalTweets": 15423,
      "totalUsers": 8735,
      "totalViews": 9832000,
      "totalEngagement": 752300
    },
    "sentimentData": [
      { "name": "إيجابي", "value": 67 },
      { "name": "محايد", "value": 23 },
      { "name": "سلبي", "value": 10 }
    ],
    "topKeywords": [
      { "keyword": "فوز تاريخي", "count": 3245 },
      { "keyword": "أبطال", "count": 2987 },
      { "keyword": "ميسي", "count": 2453 },
      { "keyword": "المنتخب السعودي", "count": 2289 },
      { "keyword": "كأس العالم", "count": 1876 }
    ],
    "languageBreakdown": [
      { "name": "العربية", "value": 75 },
      { "name": "الإنجليزية", "value": 15 },
      { "name": "الإسبانية", "value": 7 },
      { "name": "أخرى", "value": 3 }
    ],
    "timeSeriesData": [
      { "time": "12:00", "tweets":  500 },
      { "time": "12:15", "tweets": 1200 },
      { "time": "12:30", "tweets": 1800 },
      { "time": "12:45", "tweets": 2500 },
      { "time": "13:00", "tweets": 3200 },
      { "time": "13:15", "tweets": 8500 },
      { "time": "13:30", "tweets": 12000 },
      { "time": "13:45", "tweets": 15000 },
      { "time": "14:00", "tweets": 10500 }
    ],
    "topTweets": [
      // Top 5 tweets based on engagement
    ],
    "topInfluencers": [
      // Top 5 influencers engaged with the topic
    ],
    "locationData": [
      { "name": "السعودية", "value": 65 },
      { "name": "مصر", "value": 12 },
      { "name": "الإمارات", "value": 8 },
      { "name": "قطر", "value": 7 },
      { "name": "أخرى", "value": 8 }
    ]
  }
}
```

### Generate Report
- **Endpoint**: `/reports`
- **Method**: `POST`
- **Headers**: Authorization token required
- **Body**:
```json
{
  "title": "تحليل حادث انفجار الخبر",
  "description": "تقرير تحليلي عن ردود الفعل على وسائل التواصل الاجتماعي حول حادث انفجار الخبر",
  "query": "انفجار الخبر",
  "period": {
    "start": "2023-06-15T00:00:00Z",
    "end": "2023-06-16T00:00:00Z"
  },
  "type": "event"
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Report generation started",
  "data": {
    "id": "report-124",
    "title": "تحليل حادث انفجار الخبر",
    "status": "processing",
    "estimatedCompletion": "2023-06-30T12:15:00Z"
  }
}
```

### Export Report
- **Endpoint**: `/reports/{reportId}/export`
- **Method**: `GET`
- **Headers**: Authorization token required
- **Parameters**:
  - `format`: Export format (pdf, excel, image)
- **Response**: Binary file download

## Error Handling
All endpoints return appropriate HTTP status codes:
- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

Error responses follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "affected_field",
      "message": "Specific error message"
    }
  ],
  "code": "ERROR_CODE"
}
```

## Rate Limiting
API requests are limited to 100 requests per minute per authenticated user. Unauthenticated requests are limited to 20 requests per minute per IP address.

## Authentication
All authenticated endpoints require an Authorization header with a valid JWT token:
```
Authorization: Bearer <your_token>
```

Tokens expire after 24 hours, at which point a new login request must be performed.

## Language Support
All text responses support both Arabic and English based on the Accept-Language header:
```
Accept-Language: ar
```
