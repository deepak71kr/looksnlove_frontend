import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [user, setUser] = useState(getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(!!getStoredUser());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Configure axios defaults
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  axios.defaults.headers.common['Content-Type'] = 'application/json';

  // Check authentication status on mount and token expiration
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/check-auth');
        console.log('Auth check response:', response.data);
        
        if (response.data.success && response.data.isAuthenticated) {
          const userData = response.data.user;
          setUser(userData);
          setStoredUser(userData);
          setIsAuthenticated(true);
        } else {
          // Only redirect to login if not on login or signup pages
          if (!['/login', '/signup'].includes(window.location.pathname)) {
            handleLogout();
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Only redirect to login if not on login or signup pages
        if (!['/login', '/signup'].includes(window.location.pathname)) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    setUser(null);
    setStoredUser(null);
    setIsAuthenticated(false);
    if (window.location.pathname !== '/login') {
      navigate('/login');
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('Attempting login for:', email);

      const response = await axios.post('/api/user/login', 
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
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/user/signup', 
        userData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (response.data.success) {
        // After successful signup, log the user in
        const loginResponse = await axios.post('/api/user/login', 
          { email: userData.email, password: userData.password },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        
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
      // Don't call handleLogout here as it forces navigation to login
      setLoading(false);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      handleLogout();
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 