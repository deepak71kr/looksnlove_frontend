import axios from 'axios';

// Create a simple cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  credentials: 'include'
});

// Add request interceptor for caching
api.interceptors.request.use(
  (config) => {
    // Don't cache POST, PUT, DELETE requests
    if (['post', 'put', 'delete'].includes(config.method?.toLowerCase())) {
      return config;
    }

    const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
    const cachedResponse = cache.get(cacheKey);

    if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION) {
      // Return cached response
      return Promise.reject({
        __CACHE__: true,
        data: cachedResponse.data
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for caching
api.interceptors.response.use(
  (response) => {
    // Cache GET requests
    if (response.config.method?.toLowerCase() === 'get') {
      const cacheKey = `${response.config.url}${JSON.stringify(response.config.params || {})}`;
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    return response;
  },
  (error) => {
    // Handle cached responses
    if (error.__CACHE__) {
      return Promise.resolve({ data: error.data });
    }
    return Promise.reject(error);
  }
);

// Debounce function
let debounceTimer;
export const debounceRequest = (config) => {
  return new Promise((resolve, reject) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      api(config)
        .then(resolve)
        .catch(reject);
    }, 300); // 300ms debounce
  });
};

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    // Log request details
    console.log('Making request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      withCredentials: config.withCredentials,
      data: config.data,
      cookies: document.cookie // Log cookies being sent
    });

    // Ensure credentials are included
    config.withCredentials = true;
    config.credentials = 'include';

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log response details
    console.log('Received response:', {
      url: response.config.url,
      status: response.status,
      headers: response.headers,
      data: response.data,
      cookies: document.cookie // Log cookies after response
    });

    // Check if we got a new token in the response
    if (response.headers['set-cookie']) {
      console.log('Received new cookie:', response.headers['set-cookie']);
    }

    return response;
  },
  (error) => {
    // Log error details
    console.error('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      cookies: document.cookie // Log cookies on error
    });

    // Handle 401 errors
    if (error.response?.status === 401) {
      // Don't redirect if we're already on the login page or checking auth
      const isAuthCheck = error.config?.url === '/api/auth/check';
      const isLoginPage = window.location.pathname === '/login';
      
      if (!isAuthCheck && !isLoginPage) {
        console.log('Unauthorized access, redirecting to login');
        // Clear any existing user data
        localStorage.removeItem('user');
        // Redirect to login
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api; 