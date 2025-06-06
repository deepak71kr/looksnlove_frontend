import React from 'react';
import { X } from 'lucide-react';
import { FaUser, FaShoppingCart, FaCalendarAlt, FaEnvelope, FaSync } from 'react-icons/fa';

const OrderDetailsModal = ({ selectedOrder, handleCloseModal, handleStatusChange }) => {
  if (!selectedOrder) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]" onClick={handleCloseModal}>
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white pb-4 border-b border-gray-200 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
            <button
              onClick={handleCloseModal}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
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
  );
};

export default OrderDetailsModal; 