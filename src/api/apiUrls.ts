
import { API_URL_BASE } from '@/config/env';

// Define all API endpoints
const API_ENDPOINTS = {
  // Auth related endpoints
  auth: {
    login: '/api/auth/login/',
    verify: '/api/auth/verify/',
    register: '/api/auth/register/',
  },
  
  // Search related endpoints
  search: {
    query: '/api/search-queries',
    suggestions: '/api/search-suggestions/',
    trending: '/api/trending-topics/',
    filter: '/api/search-filter/',
    status: '/api/search-queries', // Updated to match new API
    cancel: '/api/search-queries/cancel/',
  },
  
  // Analysis related endpoints
  analysis: {
    overview: '/api/analysis',
    sentiment: '/api/analysis/sentiment/',
    trends: '/api/analysis/trends/',
    tweets: '/api/tweets',
    influencers: '/api/analysis/influencers/',
    timeline: '/api/analysis/timeline/',
    location: '/api/analysis/location/',
    export: '/api/analysis/export/',
  },
  
  // User related endpoints
  user: {
    profile: '/api/user/profile/',
    interests: '/api/user/interests/',
    preferences: '/api/user/preferences/',
    saved: '/api/user/saved/',
    history: '/api/user/history/',
  },
  
  // Reports related endpoints
  reports: {
    list: '/api/reports/',
    details: (id: string) => `/api/reports/${id}/`,
    analytics: (id: string) => `/api/reports/${id}/analytics/`,
    export: (id: string, format: string) => `/api/reports/${id}/export/?format=${format}`,
  },
  
  // Monitoring related endpoints
  monitoring: {
    topics: '/api/monitoring/topics/',
    alerts: '/api/monitoring/alerts/',
    configure: '/api/monitoring/configure/',
    events: '/api/monitoring/events/',
  },

  // Tweet related endpoints
  tweets: {
    list: '/api/tweets/',
    details: (id: string) => `/api/tweets/${id}/`,
    popular: '/api/tweets/popular/',
    earliest: '/api/tweets/earliest/',
    latest: '/api/tweets/latest/',
  }
};

// Function to generate full API URLs
export const apiUrl = (endpoint: string): string => {
  return `${API_URL_BASE}${endpoint}`;
};

export default API_ENDPOINTS;
