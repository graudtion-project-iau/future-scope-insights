
// Environment variables configuration

// Set the API URL from environment or use the provided Futvi API URL
const API_URL = import.meta.env.VITE_API_URL || 'https://Futvi.com/api';
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://future-scope-insights.com';

// Configuration object with all environment variables
export const env = {
  // API base URL
  API_URL,
  
  // Site URL for SEO
  SITE_URL,
  
  // Flag to determine if we're in development mode
  IS_DEV: import.meta.env.MODE === 'development',
  
  // Flag for enabling/disabling API mocking
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === 'true',
};

// Export individual variables for convenience
export const API_URL_BASE = env.API_URL;
export const SITE_URL_BASE = env.SITE_URL;
