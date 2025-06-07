import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// Helper functions for localStorage
const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Configure axios defaults
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  axios.defaults.headers.common['Accept'] = 'application/json';
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

  // Add response interceptor for better error handling
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Axios error:', {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });

        if (error.response?.status === 401) {
          // Only logout if we're not on a public route
          const publicRoutes = ['/', '/services', '/about-us', '/contact', '/login', '/signup'];
          if (!publicRoutes.includes(window.location.pathname)) {
            handleLogout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      console.log('Checking auth status...');
      const response = await axios.get('/api/auth/check-auth', {
        withCredentials: true
      });
      
      console.log('Auth check response:', response.data);
      
      if (response.data.success && response.data.isAuthenticated) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        setStoredUser(response.data.user);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Auth check error:', error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = useCallback(() => {
    console.log('Handling logout...');
    setUser(null);
    setStoredUser(null);
    setIsAuthenticated(false);
    // Clear any stored tokens or auth data
    localStorage.removeItem('user');
    // Only navigate to login if we're not already on a public route
    const publicRoutes = ['/', '/services', '/about-us', '/contact', '/login', '/signup'];
    if (!publicRoutes.includes(window.location.pathname)) {
      navigate('/login');
    }
  }, [navigate]);

  const login = useCallback(async (email, password) => {
    try {
      console.log('Attempting login...');
      setLoading(true);
      const response = await axios.post('/api/auth/login', 
        { email, password },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      console.log('Login response:', response.data);
      
      if (response.data.success && response.data.user) {
        const userData = response.data.user;
        setUser(userData);
        setStoredUser(userData);
        setIsAuthenticated(true);
        navigate('/');
        return true;
      }
      throw new Error(response.data.message || 'Login failed. Please try again.');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      handleLogout();
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [navigate, handleLogout]);

  const signup = useCallback(async (userData) => {
    try {
      console.log('Attempting signup...');
      setLoading(true);
      const response = await axios.post('/api/auth/signup', 
        userData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      console.log('Signup response:', response.data);
      
      if (response.data.success) {
        // After successful signup, log the user in
        const loginResponse = await axios.post('/api/auth/login', 
          { email: userData.email, password: userData.password },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        
        console.log('Auto-login response:', loginResponse.data);
        
        if (loginResponse.data.success && loginResponse.data.user) {
          const userData = loginResponse.data.user;
          setUser(userData);
          setStoredUser(userData);
          setIsAuthenticated(true);
          navigate('/');
          return true;
        }
      }
      throw new Error(response.data.message || 'Signup failed. Please try again.');
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      console.log('Attempting logout...');
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      handleLogout();
    }
  }, [handleLogout]);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 