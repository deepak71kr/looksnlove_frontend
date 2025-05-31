import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';

const CheckoutSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="text-green-500" size={64} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. We will process it shortly and keep you updated on the status.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/orders')}
            className="w-full flex items-center justify-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            <Package size={20} className="mr-2" />
            View Order History
          </button>
          <Link
            to="/"
            className="block w-full px-4 py-2 text-center text-gray-700 hover:text-pink-600"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess; 