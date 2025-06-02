import React, { createContext, useContext, useState, useEffect } from 'react';
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

  const fetchCartItems = async () => {
    console.log('Fetching cart, isAuthenticated:', isAuthenticated);
    if (!isAuthenticated || !user) {
      // Load from localStorage when not authenticated
      const savedCart = localStorage.getItem('cart');
      console.log('Loading from localStorage (not authenticated):', savedCart);
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
        withCredentials: true
      });
      console.log('Cart API response:', response.data);
      setCartItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      // If API fails, try to load from localStorage
      const savedCart = localStorage.getItem('cart');
      console.log('Loading from localStorage:', savedCart);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [isAuthenticated, user]);

  // Save to localStorage when not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('Saving to localStorage:', cartItems);
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addToCart = async (serviceData) => {
    console.log('Adding to cart:', serviceData);
    if (!isAuthenticated || !user) {
      navigate('/login');
      return false;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/cart/add', 
        serviceData,
        {
          withCredentials: true
        }
      );
      
      console.log('Add to cart API response:', response.data);
      if (response.data.items) {
        setCartItems(response.data.items);
        return true;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.response?.status === 401) {
        navigate('/login');
        return false;
      } else {
        // Add to local cart as fallback
        setCartItems(prevItems => {
          const existingItem = prevItems.find(i => i._id === serviceData._id);
          if (existingItem) {
            console.log('Item already in cart');
            return prevItems;
          }
          const newItems = [...prevItems, { ...serviceData, _id: Date.now().toString() }];
          console.log('New cart items:', newItems);
          return newItems;
        });
        return true;
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    console.log('Removing from cart:', itemId);
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(`/api/cart/remove/${itemId}`, {
        withCredentials: true
      });
      
      console.log('Remove from cart API response:', response.data);
      if (response.data.items) {
        setCartItems(response.data.items);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        // Remove from local cart as fallback
        setCartItems(prevItems => {
          const newItems = prevItems.filter(item => item._id !== itemId);
          console.log('New cart items after removal:', newItems);
          return newItems;
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    console.log('Clearing cart');
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      await axios.delete('/api/cart/clear', {
        withCredentials: true
      });
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  console.log('Current cart state:', { cartItems, cartTotal, loading });

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