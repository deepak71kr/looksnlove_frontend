import React from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Cart = () => {
  const { cartItems, loading, removeFromCart, clearCart } = useCart();
  const { isAuthenticated, setIsAuthenticated, setUser, setError } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const initializeAuth = async () => {
    // Clear any existing tokens
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];

    const token = localStorage.getItem('token');
    if (token) {
      // Set token and verify with server
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // ... verify token with server
    }
  };

  const getImagePath = (imagePath) => {
    if (!imagePath) return defaultImage;
    // If the path starts with /, it's already absolute
    if (imagePath.startsWith('/')) return imagePath;
    // Otherwise, prepend /categories_images/
    return `/categories_images/${imagePath}`;
  };

  const handleImageError = (e) => {
    console.log('Image failed to load:', e.target.src);
    // Try to load from the public directory first
    if (!e.target.src.includes('/public/') && !e.target.src.includes(defaultImage)) {
      e.target.src = `/public${e.target.src}`;
    } else {
      // If that fails, use the default image
      e.target.src = defaultImage;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/services')}
            className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600"
          >
            Browse Services
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{item.serviceName}</h3>
                    <p className="text-gray-600">{item.category}</p>
                    <p className="text-gray-600">Date: {item.date}</p>
                    <p className="text-gray-600">Time: {item.time}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold">${item.price}</span>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-700"
              >
                Clear Cart
              </button>
              <div className="text-right">
                <p className="text-lg font-semibold">Total: ${cartItems.reduce((sum, item) => sum + item.price, 0)}</p>
                <button
                  onClick={handleCheckout}
                  className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart; 