import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUsers, FaBox, FaShoppingCart, FaEnvelope, FaCalendarAlt, FaClock, FaUser, FaPhone, FaSync, FaCheck, FaInfoCircle, FaListAlt, FaStar, FaPercent } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Package, Percent, PlusCircle, Star, Settings, X, ChevronDown, CheckCircle2, MessageSquare, ShoppingBag, Tag } from 'lucide-react';

const AdminDashboard = () => {
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    ongoing: 0,
    postponed: 0,
    completed: 0
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchRecentAppointments();
    fetchOrders();
  }, [user, navigate]);

  useEffect(() => {
    if (selectedOrder) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedOrder]);

  const fetchRecentAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/contact/admin', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // Filter out hidden appointments and get the most recent 5
      const recent = response.data
        .filter(appointment => !appointment.hidden)
        .slice(0, 5);
      
      setRecentAppointments(recent);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch appointments');
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/orders/admin', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!Array.isArray(response.data)) {
        setError('Invalid response format from server');
        return;
      }
      
      const sortedOrders = response.data.sort((a, b) => {
        const statusPriority = {
          'postponed': 0,
          'ongoing': 1,
          'completed': 2
        };
        
        const statusDiff = statusPriority[a.status] - statusPriority[b.status];
        if (statusDiff !== 0) return statusDiff;
        
        return new Date(a.deliveryDate) - new Date(b.deliveryDate);
      });
      
      setOrders(sortedOrders);
      
      const counts = sortedOrders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});
      
      setStatusCounts({
        ongoing: counts.ongoing || 0,
        postponed: counts.postponed || 0,
        completed: counts.completed || 0
      });
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Please log in as admin to view orders');
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Failed to fetch orders. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeSlot) => {
    if (!timeSlot) return '';
    
    // Handle different time formats
    if (timeSlot.includes('-')) {
      return timeSlot;
    }
    
    // Handle "to" format
    if (timeSlot.includes(' to ')) {
      const [start, end] = timeSlot.split(' to ').map(time => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const hour12 = hour % 12 || 12;
        return `${hour12}${minutes ? ':' + minutes : ''}${ampm}`;
      });
      return `${start} - ${end}`;
    }

    // Handle single time
    const [hours, minutes] = timeSlot.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'pm' : 'am';
    const hour12 = hour % 12 || 12;
    return `${hour12}${minutes ? ':' + minutes : ''}${ampm}`;
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDropdownOpen(false);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleRefresh = () => {
    fetchOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(
        `/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));

      const oldStatus = selectedOrder.status;
      setStatusCounts(prev => ({
        ...prev,
        [oldStatus]: Math.max(0, prev[oldStatus] - 1),
        [newStatus]: (prev[newStatus] || 0) + 1
      }));
      
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));

      if (newStatus === 'completed') {
        handleCloseModal();
      }

      setTimeout(() => {
        fetchOrders();
      }, 1000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to update order status. Please try again.';
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleOptionClick = (section) => {
    setActiveSection(section);
    setIsDropdownOpen(false);
    switch (section) {
      case 'orders':
        navigate('/admin-dashboard/orders');
        break;
      case 'ratings':
        navigate('/admin-dashboard/ratings');
        break;
      case 'discounts':
        navigate('/admin-dashboard/discounts');
        break;
      default:
        break;
    }
  };

  const handleAppointmentComplete = async (appointmentId) => {
    try {
      const response = await axios.patch(
        `/api/contact/${appointmentId}/status`,
        { status: 'confirmed' },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        // Remove the completed appointment from the list
        setRecentAppointments(prev => 
          prev.filter(appointment => appointment._id !== appointmentId)
        );
      }
    } catch (error) {
      console.error('Error completing appointment:', error);
      setError(error.response?.data?.error || 'Failed to update appointment status. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-[1001]">
          <span className="block sm:inline">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <X size={20} />
          </button>
          </div>
        )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
        <div className="relative w-full sm:w-auto">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50"
            >
              <span>Manage</span>
              <ChevronDown size={16} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  <Link
                    to="/admin-dashboard/orders"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ShoppingBag size={16} className="mr-2" /> Manage Orders
                  </Link>
                  <Link
                    to="/admin-dashboard/ratings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Star size={16} className="mr-2" /> Ratings
                  </Link>
                  <button
                    disabled={true}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                  >
                    <Tag size={16} className="mr-2" /> Discounts
                  </button>
                </div>
              </div>
            )}
                </div>
              </div>
            </div>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-xl sm:text-2xl font-semibold">Orders Management</h2>
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors duration-150"
          >
            <FaSync className="h-4 w-4" />
            <span>Refresh</span>
          </button>
                </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-purple-600 font-medium">Ongoing</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-700">{statusCounts.ongoing}</p>
                </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <Package className="text-purple-600" size={24} />
              </div>
            </div>
                </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-orange-600 font-medium">Postponed</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-700">{statusCounts.postponed}</p>
                </div>
              <div className="bg-orange-100 p-2 rounded-full">
                <Package className="text-orange-600" size={24} />
              </div>
            </div>
                </div>
          <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Completed</p>
                <p className="text-xl sm:text-2xl font-bold text-emerald-700">{statusCounts.completed}</p>
                </div>
              <div className="bg-emerald-100 p-2 rounded-full">
                <Package className="text-emerald-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading orders...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-600">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <div className="max-h-[400px] overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">#{order._id.slice(-6)}</td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{order.customerDetails.name}</td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        {new Date(order.deliveryDate).toLocaleDateString()}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">₹{order.total}</td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'ongoing' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'postponed' ? 'bg-orange-100 text-orange-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                <button
                          onClick={() => handleViewDetails(order)} 
                          className="text-pink-600 hover:text-pink-900 font-medium"
                >
                          View Details
                </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]" data-aos="fade-up">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white pb-4 border-b border-gray-200 z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3 text-pink-800 flex items-center">
                  <FaUser className="mr-2" /> Customer Information
                </h3>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <span className="font-medium w-24">Name:</span>
                    <span className="text-gray-700">{selectedOrder.customerDetails.name}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-24">Phone:</span>
                    <span className="text-gray-700">{selectedOrder.customerDetails.phone}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-24">Address:</span>
                    <span className="text-gray-700">{selectedOrder.customerDetails.address}</span>
                  </p>
            </div>
          </div>
          
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3 text-pink-800 flex items-center">
                  <FaShoppingCart className="mr-2" /> Order Items
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-pink-100">
                    <p className="text-sm text-gray-600">Total Items: {selectedOrder.items.length}</p>
                  </div>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-pink-100 last:border-0">
                      <div>
                        <p className="font-medium text-gray-800">{item.serviceName}</p>
                        <p className="text-sm text-gray-600">{item.category}</p>
                      </div>
                      <p className="font-medium text-pink-600">₹{item.price}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 font-bold text-gray-800 border-t border-pink-100">
                    <p>Total Amount</p>
                    <p className="text-pink-600">₹{selectedOrder.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3 text-pink-800 flex items-center">
                  <FaCalendarAlt className="mr-2" /> Delivery Information
                </h3>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <span className="font-medium w-24">Date:</span>
                    <span className="text-gray-700">{new Date(selectedOrder.deliveryDate).toLocaleDateString()}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="font-medium w-24">Time:</span>
                    <span className="text-gray-700">{selectedOrder.deliveryTime}</span>
                  </p>
                </div>
              </div>

              {selectedOrder.additionalInstructions && (
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3 text-pink-800 flex items-center">
                    <FaEnvelope className="mr-2" /> Additional Instructions
                  </h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedOrder.additionalInstructions}</p>
                </div>
              )}

              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
                <h3 className="font-medium mb-3 text-pink-800 flex items-center">
                  <FaSync className="mr-2" /> Status Management
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleStatusChange(selectedOrder._id, 'ongoing')}
                    className={`p-3 rounded-lg text-center transition-all duration-200 ${
                      selectedOrder.status === 'ongoing'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                    }`}
                  >
                    Ongoing
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedOrder._id, 'postponed')}
                    className={`p-3 rounded-lg text-center transition-all duration-200 ${
                      selectedOrder.status === 'postponed'
                        ? 'bg-orange-600 text-white shadow-lg'
                        : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                    }`}
                  >
                    Postponed
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedOrder._id, 'completed')}
                    className={`p-3 rounded-lg text-center transition-all duration-200 ${
                      selectedOrder.status === 'completed'
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold flex items-center gap-2"
                >
                  <X size={20} />
                  <span>Close</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Appointments</h2>
          <button
            onClick={fetchRecentAppointments}
            className="flex items-center space-x-2 px-4 py-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors duration-150"
          >
            <FaSync className="w-5 h-5" />
            <span>Refresh</span>
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : recentAppointments.length === 0 ? (
          <div className="text-gray-500 text-center p-4">No appointments found</div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaUser className="text-pink-600" />
                      <span className="font-medium">{appointment.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <FaPhone className="text-pink-600" />
                      <span>{appointment.phone}</span>
                    </div>
                    {appointment.email && (
                      <div className="flex items-center space-x-2 mb-2">
                        <FaEnvelope className="text-pink-600" />
                        <span className="text-sm">{appointment.email}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 mb-2">
                      <FaCalendarAlt className="text-pink-600" />
                      <span>{formatDate(appointment.date)}</span>
                        </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <FaClock className="text-pink-600" />
                      <span>{formatTime(appointment.timeSlot)}</span>
                        </div>
                    {appointment.message && (
                      <div className="mt-2 text-gray-600 flex-grow">
                        <p className="font-medium">Message:</p>
                        <p className="text-sm line-clamp-2">{appointment.message}</p>
                      </div>
                    )}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleAppointmentComplete(appointment._id)}
                        className="px-4 py-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors duration-150 flex items-center space-x-2"
                      >
                        <FaCheck className="w-4 h-4" />
                        <span>Mark as Completed</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default AdminDashboard; 