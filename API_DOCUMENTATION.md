
# Future Vision API Documentation

## Overview
This document provides information about the API endpoints, request formats, and expected response structures for the Future Vision platform.

## Base URL
- **Development**: http://127.0.0.1:8000
- **Production**: https://api.futurevision.com

## Authentication
Most endpoints require authentication using a JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Common Response Format
All API responses follow a standard format:

```json
{
  "success": true|false,
  "message": "Description of the result or error",
  "data": { ... } | null,
  "errors": [ ... ] | null
}
```

## Error Handling
Errors are returned with appropriate HTTP status codes and an error message:

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
  "data": null
}
```

## Endpoints

### Authentication

#### Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "fullName": "User Full Name",
    "phoneNumber": "05xxxxxxxx",
    "deviceId": "device_unique_id"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "userId": "user_id",
      "requiresVerification": true
    }
  }
  ```

#### Verify OTP
- **URL**: `/auth/verify`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "phoneNumber": "05xxxxxxxx",
    "otp": "1234"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Verification successful",
    "data": {
      "token": "jwt_token_here",
      "expiresAt": "timestamp"
    }
  }
  ```

### Search

#### Perform Search
- **URL**: `/search`
- **Method**: `GET`
- **Query Parameters**:
  - `q`: Search query
  - `from`: Start date (YYYY-MM-DD)
  - `to`: End date (YYYY-MM-DD)
  - `sources`: Comma-separated sources
  - `limit`: Number of results (default: 20)
  - `page`: Page number (default: 1)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "query": "search query",
      "results": [...],
      "summary": {
        "total": 123,
        "sentiments": {
          "positive": 70,
          "neutral": 30,
          "negative": 23
        }
      },
      "pagination": {
        "page": 1,
        "limit": 20,
        "totalPages": 7
      }
    }
  }
  ```

### User Management

#### Update User Interests
- **URL**: `/user/interests`
- **Method**: `PUT`
- **Request Body**:
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

#### Update Notification Preferences
- **URL**: `/user/preferences`
- **Method**: `PUT`
- **Request Body**:
  ```json
  {
    "notifications": {
      "email": true,
      "sms": false,
      "whatsapp": true
    },
    "frequency": "instant|daily|weekly"
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

### Reports

#### Get Reports List
- **URL**: `/reports`
- **Method**: `GET`
- **Query Parameters**:
  - `type`: Report type
  - `limit`: Number of results (default: 10)
  - `page`: Page number (default: 1)
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "reports": [...],
      "pagination": {
        "page": 1,
        "limit": 10,
        "totalPages": 5
      }
    }
  }
  ```

#### Get Report Details
- **URL**: `/reports/{reportId}`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "report_id",
      "title": "Report Title",
      "createdAt": "timestamp",
      "summary": "Report summary",
      "metrics": {...},
      "sentimentData": [...],
      "topKeywords": [...],
      "languageBreakdown": [...],
      "timeSeriesData": [...]
    }
  }
  ```

### Monitoring

#### Get Monitoring Topics
- **URL**: `/monitoring/topics`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "topics": [
        {
          "id": "topic_id",
          "name": "Topic Name",
          "keywords": ["keyword1", "keyword2"],
          "active": true
        }
      ]
    }
  }
  ```

#### Configure Monitoring
- **URL**: `/monitoring/configure`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "topics": ["topic_id1", "topic_id2"],
    "keywords": ["keyword1", "keyword2"],
    "alertThreshold": "high|medium|low"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Monitoring configuration updated",
    "data": {
      "monitoringId": "config_id",
      "topics": ["topic_id1", "topic_id2"],
      "keywords": ["keyword1", "keyword2"],
      "alertThreshold": "medium"
    }
  }
  ```

## Notes for Developers
- All text responses support both Arabic and English based on the Accept-Language header
- Dates should be in ISO 8601 format
- For file uploads, use multipart/form-data content type
- Rate limiting is applied: 100 requests per minute per API key
