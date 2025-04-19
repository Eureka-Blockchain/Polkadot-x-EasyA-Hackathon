// Fetch wrapper with authentication and error handling

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface FetchOptions extends RequestInit {
  token?: string | null;
  params?: Record<string, string>;
  mockData?: any; // Optional mock data for development fallback
}

interface FetchError extends Error {
  status?: number;
  data?: any;
  isNetworkError?: boolean;
}

/**
 * Wrapper around fetch API with built-in error handling and auth
 */
const fetchWrapper = {
  /**
   * GET request
   */
  async get<T = any>(url: string, options: FetchOptions = {}): Promise<T> {
    return requestWithMethod<T>('GET', url, undefined, options);
  },

  /**
   * POST request
   */
  async post<T = any>(url: string, body: any, options: FetchOptions = {}): Promise<T> {
    return requestWithMethod<T>('POST', url, body, options);
  },

  /**
   * PUT request
   */
  async put<T = any>(url: string, body: any, options: FetchOptions = {}): Promise<T> {
    return requestWithMethod<T>('PUT', url, body, options);
  },

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, options: FetchOptions = {}): Promise<T> {
    return requestWithMethod<T>('DELETE', url, undefined, options);
  },
};

/**
 * Helper function for requests with different methods
 */
async function requestWithMethod<T>(
  method: string,
  url: string,
  body?: any,
  options: FetchOptions = {}
): Promise<T> {
  // Build the full URL with params if provided
  let fullUrl = `${API_URL}${url}`;
  
  // Add query params if they exist
  if (options.params) {
    const searchParams = new URLSearchParams();
    for (const key in options.params) {
      searchParams.append(key, options.params[key]);
    }
    fullUrl += `?${searchParams.toString()}`;
  }

  // Setup headers
  const headers = new Headers(options.headers);
  
  // Set content type if not already set and we have a body
  if (body && !headers.has('Content-Type')) {
    headers.append('Content-Type', 'application/json');
  }
  
  // Add auth token if provided
  if (options.token) {
    headers.append('Authorization', `Bearer ${options.token}`);
  }

  // Setup request options
  const requestOptions: RequestInit = {
    method,
    headers,
    ...options,
  };

  // Add body if it exists
  if (body) {
    requestOptions.body = JSON.stringify(body);
  }

  try {
    // For development: if mock data is provided and we're in development, return it immediately
    if (process.env.NODE_ENV === 'development' && options.mockData) {
      console.log(`[DEV] Using mock data for ${method} ${url}`);
      return options.mockData as T;
    }

    // Timeout for fetch request (10 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    requestOptions.signal = controller.signal;

    const response = await fetch(fullUrl, requestOptions);
    clearTimeout(timeoutId);
    
    // Check for successful response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.detail || response.statusText) as FetchError;
      error.status = response.status;
      error.data = errorData;
      throw error;
    }
    
    // If response status is 204 (No Content) or the response is empty, return empty object/null
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }
    
    // Parse JSON
    return await response.json();
  } catch (error: any) {
    // Check if this is a network error (like server not running)
    const isNetworkError = (
      error.name === 'TypeError' || 
      error.name === 'AbortError' || 
      error.message === 'Failed to fetch' ||
      !navigator.onLine
    );

    if (isNetworkError && process.env.NODE_ENV === 'development') {
      console.warn(`Network error for ${method} ${url}. Using fallback mock data if available.`);
      
      // If mockData is provided, use it as a fallback in development
      if (options.mockData) {
        console.log(`[DEV] Using mock data for ${method} ${url} after network error`);
        return options.mockData as T;
      }
    }

    // Enhance error with more info
    if (error instanceof Error) {
      (error as FetchError).isNetworkError = isNetworkError;
      console.error(`API request failed: ${method} ${url}`, error);
    }
    
    throw error;
  }
}

export default fetchWrapper; 