import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

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