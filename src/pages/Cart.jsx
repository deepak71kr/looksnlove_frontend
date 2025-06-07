import React, { useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { cartItems, loading, removeFromCart, clearCart, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  }, [isAuthenticated, navigate]);

  const handleRemoveItem = useCallback((itemId) => {
    removeFromCart(itemId);
  }, [removeFromCart]);

  const handleClearCart = useCallback(() => {
    clearCart();
  }, [clearCart]);

  const handleContinueShopping = useCallback(() => {
    navigate('/services');
  }, [navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white shadow-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-pink-500" size={24} />
              <h1 className="text-2xl font-bold">Shopping Cart</h1>
            </div>
            <button
              onClick={handleContinueShopping}
              className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors"
            >
              <ArrowLeft size={20} />
              Continue Shopping
            </button>
          </div>
        </div>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md mt-4">
            <ShoppingBag className="mx-auto text-gray-400" size={48} />
            <p className="text-gray-600 mt-4 mb-6">Your cart is empty</p>
            <button
              onClick={handleContinueShopping}
              className="bg-pink-500 text-white px-8 py-3 rounded-md hover:bg-pink-600 transition-colors"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-4">
            {/* Cart Items */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cartItems.map((item) => (
                  <div 
                    key={item._id} 
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                        <h3 className="text-base font-medium text-gray-800 mb-2">{item.serviceName}</h3>
                        <p className="text-lg font-semibold text-pink-600">{formatPrice(item.price)}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="mt-3 text-red-500 hover:text-red-700 text-sm py-1.5 px-3 border border-red-500 rounded-md hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Items</span>
                    <span>{cartItems.length}</span>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-pink-600">{formatPrice(cartTotal)}</span>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <button
                      onClick={handleClearCart}
                      className="w-full px-6 py-3 text-red-500 hover:text-red-700 border border-red-500 rounded-md hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={20} />
                      Clear Cart
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="w-full px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={20} />
                      {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
