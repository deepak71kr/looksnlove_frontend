import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartButton = ({ className = '', showCount = true }) => {
  const { cartItems, loading } = useCart();

  return (
    <Link 
      to="/cart" 
      className={`p-2 hover:bg-pink-100 rounded-full transition-colors relative inline-flex items-center ${className}`}
    >
      <ShoppingCart size={20} />
      {showCount && !loading && cartItems && cartItems.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {cartItems.length}
        </span>
      )}
    </Link>
  );
};

export default CartButton; 