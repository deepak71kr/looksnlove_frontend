import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { FaSync } from 'react-icons/fa';
import Notification from '../common/Notification';

const OrdersSection = ({ 
  orders, 
  loading, 
  error, 
  statusCounts, 
  handleRefresh, 
  handleViewDetails 
}) => {
  const [notification, setNotification] = useState(null);

  const handleRefreshWithNotification = async () => {
    try {
      await handleRefresh();
      setNotification({
        message: 'Orders refreshed successfully',
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: error.message || 'Failed to refresh orders',
        type: 'error'
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-semibold">Orders Management</h2>
        <button
          onClick={handleRefreshWithNotification}
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
  );
};

export default OrdersSection; 