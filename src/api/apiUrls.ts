
import { API_URL_BASE } from '@/config/env';

// Define all API endpoints
const API_ENDPOINTS = {
  // Auth related endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    verify: '/auth/verify',
  },
  
  // Search related endpoints
  search: {
    query: '/search',
    suggestions: '/search/suggestions',
  },
  
  // User related endpoints
  user: {
    profile: '/user/profile',
    interests: '/user/interests',
    preferences: '/user/preferences',
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
  }
};

// Function to generate full API URLs
export const apiUrl = (endpoint: string): string => {
  return `${API_URL_BASE}${endpoint}`;
};

export default API_ENDPOINTS;
