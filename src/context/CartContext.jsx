import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

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
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  axios.defaults.headers.common['Content-Type'] = 'application/json';

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
      const response = await axios.get('/api/cart', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success && response.data.data.items) {
        setCartItems(response.data.data.items.map(item => ({
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
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
      navigate('/login');
      return false;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/cart/add', 
        {
          serviceId: serviceData._id,
          quantity: 1
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success && response.data.data.items) {
        setCartItems(response.data.data.items.map(item => ({
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          images: item.product.images,
          quantity: item.quantity
        })));
        return true;
      }
      throw new Error('Invalid response from server');
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
        return false;
      }
      setCartItems(prevItems => {
        const existingItem = prevItems.find(i => i._id === serviceData._id);
        if (existingItem) return prevItems;
        return [...prevItems, { ...serviceData, _id: Date.now().toString() }];
      });
      return true;
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