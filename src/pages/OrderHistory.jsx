import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import { 
  Package, 
  Calendar, 
  IndianRupee, 
  Edit2, 
  X, 
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const OrderHistory = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newDeliveryDate, setNewDeliveryDate] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching orders with user:', {
        userId: user?._id,
        email: user?.email,
        isAuthenticated
      });
      
      const response = await api.get('/api/orders/my-orders');
      
      if (response.data.success) {
        // Sort orders by delivery date (most recent first)
        const sortedOrders = response.data.data.sort((a, b) => 
          new Date(b.deliveryDate) - new Date(a.deliveryDate)
        );
        
        setOrders(sortedOrders);
      } else {
        setError(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.status === 401) {
        setError('Please login to view your orders');
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch orders. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await api.patch(`/api/orders/${orderId}/cancel`);
      
      if (response.data.success) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: 'cancelled' } : order
        ));
      } else {
        setError(response.data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError(error.response?.data?.message || 'Failed to cancel order. Please try again.');
    }
  };

  const handleEditDeliveryDate = (order) => {
    setSelectedOrder(order);
    setNewDeliveryDate(order.deliveryDate);
    setIsEditing(true);
  };

  const handleUpdateDeliveryDate = async () => {
    try {
      await api.patch(
        `/api/orders/${selectedOrder._id}/delivery-date`,
        { deliveryDate: newDeliveryDate },
        { withCredentials: true }
      );
      
      setOrders(orders.map(order => 
        order._id === selectedOrder._id 
          ? { ...order, deliveryDate: newDeliveryDate }
          : order
      ));
      
      setIsEditing(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating delivery date:', error);
      setError('Failed to update delivery date. Please try again.');
    }
  };

  const toggleOrder = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'postponed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto text-gray-400" size={64} />
          <p className="mt-4 text-gray-600 text-lg">Please login to view your orders</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto text-red-400" size={64} />
          <p className="mt-4 text-red-600 text-lg">{error}</p>
          <button 
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto text-gray-400" size={64} />
          <p className="mt-4 text-gray-600 text-lg">No orders found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold mb-2">Order History</h1>
          <p className="text-gray-600">View and manage your orders</p>
        </div>
        
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div 
                className="p-4 cursor-pointer flex justify-between items-center"
                onClick={() => toggleOrder(order._id)}
              >
                <div>
                  <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.deliveryDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  {expandedOrders[order._id] ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>
              
              {expandedOrders[order._id] && (
                <div className="border-t p-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Customer Details</h3>
                      <p>Name: {order.customerDetails.name}</p>
                      <p>Phone: {order.customerDetails.phone}</p>
                      <p>Address: {order.customerDetails.address}</p>
                      <p>PIN Code: {order.customerDetails.pincode}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Order Items</h3>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{item.serviceName}</span>
                            <span>₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{order.total}</span>
                      </div>
                    </div>
                    
                    {order.additionalInstructions && (
                      <div className="border-t pt-4">
                        <h3 className="font-semibold mb-2">Additional Instructions</h3>
                        <p className="text-gray-600">{order.additionalInstructions}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Edit Delivery Date Modal */}
        {isEditing && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Edit Delivery Date</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Delivery Date
                </label>
                <input
                  type="date"
                  value={newDeliveryDate}
                  onChange={(e) => setNewDeliveryDate(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedOrder(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateDeliveryDate}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Update Date
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory; 