import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
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
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newDeliveryDate, setNewDeliveryDate] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/orders', {
        withCredentials: true
      });
      
      // Sort orders by delivery date (most recent first)
      const sortedOrders = response.data.sort((a, b) => 
        new Date(b.deliveryDate) - new Date(a.deliveryDate)
      );
      
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.patch(`/api/orders/${orderId}/cancel`, {}, {
        withCredentials: true
      });
      
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: 'cancelled' } : order
      ));
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError('Failed to cancel order. Please try again.');
    }
  };

  const handleEditDeliveryDate = (order) => {
    setSelectedOrder(order);
    setNewDeliveryDate(order.deliveryDate);
    setIsEditing(true);
  };

  const handleUpdateDeliveryDate = async () => {
    try {
      await axios.patch(
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

  const toggleOrderExpand = (orderId) => {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
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
        
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Package className="mx-auto text-gray-400" size={64} />
            <p className="mt-4 text-gray-600 text-lg">No orders found</p>
            <p className="text-gray-500">Your order history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleOrderExpand(order._id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Package className="text-pink-500" size={24} />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Order #{order._id.slice(-6)}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'ongoing' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDate(order.deliveryDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="font-medium flex items-center justify-end">
                          <IndianRupee className="text-gray-400 mr-1" size={16} />
                          {order.total}
                        </p>
                      </div>
                      {expandedOrders[order._id] ? (
                        <ChevronUp className="text-gray-400" size={20} />
                      ) : (
                        <ChevronDown className="text-gray-400" size={20} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                {expandedOrders[order._id] && (
                  <div className="border-t p-4 space-y-4">
                    {/* Customer Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-3">Customer Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-3">
                          <MapPin className="text-gray-400 mt-1" size={20} />
                          <div>
                            <p className="text-sm text-gray-600">Delivery Address</p>
                            <p className="font-medium">{order.customerDetails.address}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Phone className="text-gray-400 mt-1" size={20} />
                          <div>
                            <p className="text-sm text-gray-600">Contact Number</p>
                            <p className="font-medium">{order.customerDetails.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-3">Service Details</h3>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                              <p className="font-medium">{item.serviceName}</p>
                              <p className="text-sm text-gray-600">{item.category}</p>
                            </div>
                            <div className="flex items-center">
                              <IndianRupee className="text-gray-400 mr-1" size={16} />
                              <span className="font-medium">{item.price}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-3">Delivery Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start space-x-3">
                          <Calendar className="text-gray-400 mt-1" size={20} />
                          <div>
                            <p className="text-sm text-gray-600">Delivery Date</p>
                            <p className="font-medium">{formatDate(order.deliveryDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Clock className="text-gray-400 mt-1" size={20} />
                          <div>
                            <p className="text-sm text-gray-600">Delivery Time</p>
                            <p className="font-medium">{order.deliveryTime}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Instructions */}
                    {order.additionalInstructions && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-3 flex items-center">
                          <MessageSquare className="mr-2" size={20} />
                          Additional Instructions
                        </h3>
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {order.additionalInstructions}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {order.status === 'ongoing' && (
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => handleEditDeliveryDate(order)}
                          className="flex items-center px-4 py-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors"
                        >
                          <Edit2 size={20} className="mr-2" />
                          Edit Delivery Date
                        </button>
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <X size={20} className="mr-2" />
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

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