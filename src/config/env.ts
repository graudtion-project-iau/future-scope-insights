
// Environment variables (typically these would be loaded from .env files)

// API Base URL
export const API_URL_BASE = 'http://185.234.69.45:8001/api';

// Feature flags
export const FEATURES = {
  ENABLE_ANALYTICS: true,
  ENABLE_NOTIFICATIONS: false,
  ENABLE_REAL_TIME_UPDATES: true,
  ENABLE_EXPORT: true,
};

// App settings
export const APP_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_LOCALES: ['ar', 'en'],
  DEFAULT_LOCALE: 'ar',
  USE_MOCK_API: false, // Flag for enabling/disabling API mocking
};

// Maps configuration
export const MAPS_CONFIG = {
  DEFAULT_CENTER: { lat: 24.7136, lng: 46.6753 }, // Riyadh, Saudi Arabia
  DEFAULT_ZOOM: 5,
};
