import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaClock, FaPhone, FaUser, FaEnvelope, FaCheck, FaTimes } from 'react-icons/fa';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/messages/admin/messages');
      setMessages(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch messages');
      setLoading(false);
    }
  };

  const updateStatus = async (messageId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/messages/admin/messages/${messageId}`, {
        status: newStatus
      });
      // Refresh messages after update
      fetchMessages();
    } catch (err) {
      setError('Failed to update message status');
    }
  };

  const deleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axios.delete(`http://localhost:5000/api/messages/admin/messages/${messageId}`);
        // Refresh messages after deletion
        fetchMessages();
      } catch (err) {
        setError('Failed to delete message');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Appointment Requests</h1>
          <button
            onClick={fetchMessages}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Refresh
          </button>
        </div>
        
        <div className="grid gap-6">
          {messages.map((message) => (
            <div key={message._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaUser className="text-pink-500 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-gray-900">{message.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-pink-500 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{message.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-pink-500 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Message</p>
                      <p className="font-medium text-gray-900">{message.message}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="text-pink-500 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Requested Date</p>
                      <p className="font-medium text-gray-900">{formatDate(message.date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaClock className="text-pink-500 w-5 h-5" />
                    <div>
                      <p className="text-sm text-gray-500">Preferred Time</p>
                      <p className="font-medium text-gray-900">{message.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5"></div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          message.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : message.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {message.status || 'pending'}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateStatus(message._id, 'confirmed')}
                            className="p-1 text-green-600 hover:text-green-800"
                            title="Confirm"
                          >
                            <FaCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateStatus(message._id, 'cancelled')}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Cancel"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteMessage(message._id)}
                            className="p-1 text-gray-600 hover:text-gray-800"
                            title="Delete"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {messages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No appointment requests yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages; 