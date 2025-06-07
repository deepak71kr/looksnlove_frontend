import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, MapPin, Phone, Mail, MessageSquare, Calendar, Clock, CheckCircle2, X } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

// Helper to get today's date as a JS Date object
function getTodayDateObj() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

// Helper to get the nearest upcoming 2-hour slot from 8am to 10pm
function getUpcomingTimeSlot() {
  const now = new Date();
  const hour = now.getHours();
  if (hour < 8) return "8am - 10am";
  if (hour < 10) return "10am - 12pm";
  if (hour < 12) return "12pm - 2pm";
  if (hour < 14) return "2pm - 4pm";
  if (hour < 16) return "4pm - 7pm";
  if (hour < 18) return "6pm - 8pm";
  if (hour < 20) return "8pm - 10pm";
  // If it's 10pm or later, default to first slot tomorrow
  return "8am - 10am";
}

const timeSlots = [
  "8am - 10am",
  "10am - 12pm",
  "12pm - 2pm",
  "2pm - 4pm",
  "4pm - 6pm",
  "6pm - 8pm",
  "8pm - 10pm",
];

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: 'Jamshedpur',
    state: 'Jharkhand',
    pincode: '',
    message: ''
  });
  const [deliveryDate, setDeliveryDate] = useState(getTodayDateObj());
  const [deliveryTime, setDeliveryTime] = useState(getUpcomingTimeSlot());

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // Format the delivery date to ISO string
      const formattedDate = deliveryDate.toISOString();

      const orderData = {
        customerDetails: {
          name: formData.name,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.state}`,
          pincode: formData.pincode
        },
        items: cartItems.map(item => ({
          serviceName: item.serviceName || item.name,
          category: item.category,
          price: item.price
        })),
        total: cartTotal,
        deliveryDate: formattedDate,
        deliveryTime: deliveryTime,
        additionalInstructions: formData.message || ''
      };

      console.log('Creating order with data:', orderData);
      
      const response = await axios.post('/api/orders', orderData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Order created successfully:', response.data);
      setShowSuccessModal(true);
      clearCart();
    } catch (error) {
      console.error('Error creating order:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to create order. Please try again.';
      setError(errorMessage);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Message */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 transform transition-all animate-fade-in-up">
            <div className="flex justify-end">
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h3>
              <p className="text-gray-600 mb-6">
                Thank you for your order. We will contact you shortly with the delivery details.
              </p>
              <button
                onClick={handleCloseModal}
                className="w-full px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors shadow-sm hover:shadow-md"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white shadow-md p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="text-pink-500" size={24} />
              <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
            </div>
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Cart
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Delivery Details</h2>
                <p className="text-sm text-gray-500 mt-1">Please fill in your delivery information</p>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-white text-gray-800"
                        placeholder="Enter your full name"
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-white text-gray-800"
                        placeholder="Enter your email"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                </div>

                {/* Phone, Address, City in one row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-white text-gray-800"
                        placeholder="Enter your phone number"
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-white text-gray-800"
                        placeholder="Enter your address"
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value="Jamshedpur"
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>

                {/* PIN Code, Date and Time in one row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PIN Code</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-white text-gray-800"
                        placeholder="Enter PIN code"
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                    <div className="relative">
                      <DatePicker
                        selected={deliveryDate}
                        onChange={(date) => setDeliveryDate(date)}
                        minDate={getTodayDateObj()}
                        dateFormat="dd/MM/yyyy"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-white text-gray-800"
                        calendarClassName="text-black"
                        popperPlacement="bottom"
                        placeholderText="Select Delivery Date"
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                    <div className="relative">
                      <select
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-white text-gray-800 appearance-none"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message (Optional)</label>
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Any special instructions or requirements"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors h-24 resize-none bg-white text-gray-800"
                    />
                    <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md sticky top-8">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
                <p className="text-sm text-gray-500 mt-1">Review your order details</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Items</span>
                    <span className="text-2xl font-bold text-pink-600">{cartItems.length}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-gray-800">Total Amount</span>
                    <span className="text-3xl font-bold text-pink-600">{formatPrice(cartTotal)}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="cod"
                      name="payment"
                      value="cod"
                      checked
                      readOnly
                      className="w-4 h-4 text-pink-500 border-gray-300 focus:ring-pink-500"
                    />
                    <label htmlFor="cod" className="text-sm text-gray-600">
                      <span className="font-medium text-gray-800">Payment Method:</span> Cash on Delivery
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full px-8 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors shadow-sm hover:shadow-md"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 