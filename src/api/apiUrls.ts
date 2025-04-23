
import { API_URL_BASE } from '@/config/env';

// Define all API endpoints
const API_ENDPOINTS = {
  // Auth related endpoints
  auth: {
    login: '/auth/login',
    verify: '/auth/verify',
    register: '/auth/register',
  },
  
  // Search related endpoints
  search: {
    query: '/search',
    suggestions: '/search/suggestions',
    trending: '/search/trending',
    filter: '/search/filter',
  },
  
  // Analysis related endpoints
  analysis: {
    overview: '/analysis/overview',
    sentiment: '/analysis/sentiment',
    trends: '/analysis/trends',
    tweets: '/analysis/tweets',
    influencers: '/analysis/influencers',
    timeline: '/analysis/timeline',
    location: '/analysis/location',
  },
  
  // User related endpoints
  user: {
    profile: '/user/profile',
    interests: '/user/interests',
    preferences: '/user/preferences',
    saved: '/user/saved',
  },
  
  // Reports related endpoints
  reports: {
    list: '/reports',
    details: (id: string) => `/reports/${id}`,
    analytics: (id: string) => `/reports/${id}/analytics`,
    export: (id: string, format: string) => `/reports/${id}/export?format=${format}`,
  },
  
  // Monitoring related endpoints
  monitoring: {
    topics: '/monitoring/topics',
    alerts: '/monitoring/alerts',
    configure: '/monitoring/configure',
    events: '/monitoring/events',
  },

  // Tweet related endpoints
  tweets: {
    list: '/tweets',
    details: (id: string) => `/tweets/${id}`,
    popular: '/tweets/popular',
    earliest: '/tweets/earliest',
    latest: '/tweets/latest',
  }
};

// Function to generate full API URLs
export const apiUrl = (endpoint: string): string => {
  return `https://Futvi.com/api${endpoint}`;
};

export default API_ENDPOINTS;
