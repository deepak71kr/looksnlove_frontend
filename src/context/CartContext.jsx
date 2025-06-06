import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Configure axios defaults
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://looksnlove-backend.onrender.com';
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  axios.defaults.headers.common['Accept'] = 'application/json';
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

  // Add response interceptor to handle CORS errors
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.message === 'Network Error' && error.config) {
        // Retry the request with updated headers
        return axios({
          ...error.config,
          headers: {
            ...error.config.headers,
            'Access-Control-Allow-Origin': window.location.origin,
            'Access-Control-Allow-Credentials': 'true'
          }
        });
      }
      return Promise.reject(error);
    }
  );

  const fetchCartItems = useCallback(async () => {
    if (!isAuthenticated || !user) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('/api/cart');
      
      if (response.data.success && response.data.data.items) {
        setCartItems(response.data.data.items.map(item => ({
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price || (item.product.prices && item.product.prices[0]) || 0,
          images: item.product.images,
          quantity: item.quantity
        })));
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addToCart = useCallback(async (serviceData) => {
    if (!isAuthenticated || !user) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return false;
    }

    try {
      console.log('Adding to cart:', {
        serviceData,
        userId: user._id,
        isAuthenticated,
        apiUrl: import.meta.env.VITE_API_URL
      });

      // Ensure we have a valid service ID
      if (!serviceData._id) {
        throw new Error('Invalid service ID');
      }

      setLoading(true);
      const response = await api.post('/cart/add', {
        serviceId: serviceData._id,
        quantity: 1
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Add to cart response:', response.data);

      if (response.data.success && response.data.data.items) {
        const mappedItems = response.data.data.items.map(item => ({
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price || (item.product.prices && item.product.prices[0]) || 0,
          images: item.product.images,
          quantity: item.quantity
        }));

        setCartItems(mappedItems);
        return true;
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Add to cart error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        serviceData,
        userId: user?._id,
        headers: error.response?.headers
      });

      if (error.response?.status === 401) {
        navigate('/login');
        return false;
      }

      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, navigate]);

  const removeFromCart = useCallback(async (itemId) => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(`/api/cart/remove/${itemId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.items) {
        setCartItems(response.data.items);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setCartItems(prevItems => prevItems.filter(item => item._id !== itemId));
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, navigate]);

  const clearCart = useCallback(async () => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      await axios.delete('/api/cart/clear', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setCartItems([]);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, navigate]);

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    clearCart,
    refreshCart: fetchCartItems,
    cartTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}; 