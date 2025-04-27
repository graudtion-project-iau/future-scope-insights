
import { API_URL_BASE } from '@/config/env';
import { toast } from '@/hooks/use-toast';

// Sample data for fallback when API fails
import mockData from './mockData';

// Default request options
const defaultOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Add authorization header to requests
const addAuthHeader = (options: RequestInit): RequestInit => {
  const token = localStorage.getItem('auth_token');
  
  if (!token) return options;
  
  return {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  };
};

// Helper function to handle API errors
const handleApiError = (error: any, endpoint: string) => {
  console.error(`API Error (${endpoint}):`, error);
  
  // Show a toast with the error
  toast({
    title: 'API Error',
    description: 'Could not complete the request. Please try again later.',
    variant: 'destructive',
  });
  
  // Return null to indicate error
  return null;
};

// Main API request function
export const apiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}, 
  mockKey?: keyof typeof mockData
): Promise<T | null> => {
  try {
    // Combine default options with provided options
    const requestOptions = addAuthHeader({
      ...defaultOptions,
      ...options,
    });
    
    // If mock API is enabled and mock data exists for this endpoint
    if (false && mockKey && mockData[mockKey]) {  // Removed env.USE_MOCK_API since env no longer exists
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockData[mockKey] as T;
    }
    
    // Make the actual API request
    const response = await fetch(`${API_URL_BASE}${endpoint}`, requestOptions);
    
    // Handle non-2xx responses
    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`);
    }
    
    // Parse and return the response data
    const data = await response.json();
    return data as T;
  } catch (error) {
    // Handle any errors
    handleApiError(error, endpoint);
    
    // Return mock data as fallback if available and enabled
    if (false && mockKey && mockData[mockKey]) {  // Removed env.USE_MOCK_API
      console.info(`Using mock data for ${endpoint}`);
      return mockData[mockKey] as T;
    }
    
    return null;
  }
};

// Convenience methods for different HTTP methods
export const get = <T>(endpoint: string, mockKey?: keyof typeof mockData): Promise<T | null> => {
  return apiRequest<T>(endpoint, { method: 'GET' }, mockKey);
};

export const post = <T>(endpoint: string, body: any, mockKey?: keyof typeof mockData): Promise<T | null> => {
  return apiRequest<T>(
    endpoint, 
    { 
      method: 'POST',
      body: JSON.stringify(body)
    },
    mockKey
  );
};

export const put = <T>(endpoint: string, body: any, mockKey?: keyof typeof mockData): Promise<T | null> => {
  return apiRequest<T>(
    endpoint, 
    { 
      method: 'PUT',
      body: JSON.stringify(body)
    },
    mockKey
  );
};

export const del = <T>(endpoint: string, mockKey?: keyof typeof mockData): Promise<T | null> => {
  return apiRequest<T>(endpoint, { method: 'DELETE' }, mockKey);
};
