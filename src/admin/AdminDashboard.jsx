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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchRecentAppointments();
    fetchOrders();
  }, [user, navigate, currentPage]);

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
      
      if (!Array.isArray(response.data)) {
        setError('Invalid response format from server');
        return;
      }
      
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
      const response = await axios.get('/api/orders', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.data.success || !Array.isArray(response.data.data)) {
        setError('Invalid response format from server');
        return;
      }
      
      const sortedOrders = response.data.data.sort((a, b) => {
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

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchOrders();
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to refresh orders');
    } finally {
      setIsRefreshing(false);
    }
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
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update order status');
      }
      
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
                          error.message ||
                          'Failed to update order status. Please try again.';
      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleOptionClick = (option) => {
    setIsDropdownOpen(false);
    switch (option) {
      case 'orders':
        setActiveSection('orders');
        break;
      case 'ratings':
        navigate('/admin/ratings');
        break;
      case 'categories':
        setActiveSection('categories');
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
      
      // The backend returns the updated contact object directly
      if (!response.data || !response.data._id) {
        throw new Error('Invalid response from server');
      }
      
      // Remove the completed appointment from the list
      setRecentAppointments(prev => 
        prev.filter(appointment => appointment._id !== appointmentId)
      );
    } catch (error) {
      console.error('Error completing appointment:', error);
      setError(error.response?.data?.error || 
               error.response?.data?.message || 
               error.message ||
               'Failed to update appointment status. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
                    to="/admin/orders"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ShoppingBag size={16} className="mr-2" /> Manage Orders
                  </Link>
                  <Link
                    to="/admin/ratings"
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
            disabled={isRefreshing}
            className={`flex items-center space-x-2 px-4 py-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors duration-150 ${
              isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FaSync className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">Order Details</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-3 text-pink-800 flex items-center">
                    <FaUser className="mr-2" /> Customer Details
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">Name: {selectedOrder.customerDetails.name}</p>
                    <p className="text-gray-600">Email: {selectedOrder.customerDetails.email}</p>
                    <p className="text-gray-600">Phone: {selectedOrder.customerDetails.phone}</p>
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
                    <FaCalendarAlt className="mr-2" /> Delivery Details
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-600">Date: {formatDate(selectedOrder.deliveryDate)}</p>
                    <p className="text-gray-600">Time: {formatTime(selectedOrder.deliveryTime)}</p>
                    <p className="text-gray-600">Address: {selectedOrder.deliveryAddress}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  {selectedOrder.status !== 'completed' && (
                    <>
                      {selectedOrder.status !== 'postponed' && (
                        <button
                          onClick={() => handleStatusChange(selectedOrder._id, 'postponed')}
                          className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors duration-150"
                        >
                          Postpone
                        </button>
                      )}
                      {selectedOrder.status !== 'ongoing' && (
                        <button
                          onClick={() => handleStatusChange(selectedOrder._id, 'ongoing')}
                          className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors duration-150"
                        >
                          Mark as Ongoing
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(selectedOrder._id, 'completed')}
                        className="px-4 py-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors duration-150"
                      >
                        Mark as Completed
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {recentAppointments.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Appointments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentAppointments.map((appointment) => (
              <div key={appointment._id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-gray-800">{appointment.name}</h3>
                    <p className="text-sm text-gray-600">{appointment.email}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-pink-100 text-pink-800">
                    New
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <FaPhone className="inline mr-2" />
                    {appointment.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    <FaCalendarAlt className="inline mr-2" />
                    {formatDate(appointment.date)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <FaClock className="inline mr-2" />
                    {formatTime(appointment.time)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <FaInfoCircle className="inline mr-2" />
                    {appointment.message}
                  </p>
                </div>
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 