import React, { useState } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaClock, FaCheck, FaSync } from 'react-icons/fa';
import Notification from '../common/Notification';

const AppointmentsSection = ({ 
  recentAppointments = [], 
  loading = false, 
  error = null, 
  handleRefresh, 
  handleAppointmentComplete,
  formatDate = (date) => new Date(date).toLocaleDateString(),
  formatTime = (time) => time
}) => {
  const [notification, setNotification] = useState(null);

  const handleRefreshWithNotification = async () => {
    try {
      await handleRefresh();
      setNotification({
        message: 'Appointments refreshed successfully',
        type: 'success'
      });
    } catch (error) {
      setNotification({
        message: error.message || 'Failed to refresh appointments',
        type: 'error'
      });
    }
  };

  const handleCompleteWithConfirmation = async (appointmentId) => {
    if (window.confirm('Are you sure you want to mark this appointment as completed?')) {
      try {
        await handleAppointmentComplete(appointmentId);
        setNotification({
          message: 'Appointment marked as completed',
          type: 'success'
        });
      } catch (error) {
        setNotification({
          message: error.message || 'Failed to update appointment status',
          type: 'error'
        });
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 mt-8">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Recent Appointments</h2>
        <button
          onClick={handleRefreshWithNotification}
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
      ) : !recentAppointments || recentAppointments.length === 0 ? (
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
                    <span className="font-medium">{appointment.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FaPhone className="text-pink-600" />
                    <span>{appointment.phone || 'N/A'}</span>
                  </div>
                  {appointment.email && (
                    <div className="flex items-center space-x-2 mb-2">
                      <FaEnvelope className="text-pink-600" />
                      <span className="text-sm">{appointment.email}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 mb-2">
                    <FaCalendarAlt className="text-pink-600" />
                    <span>{appointment.date ? formatDate(appointment.date) : 'N/A'}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FaClock className="text-pink-600" />
                    <span>{appointment.timeSlot ? formatTime(appointment.timeSlot) : 'N/A'}</span>
                  </div>
                  {appointment.message && (
                    <div className="mt-2 text-gray-600 flex-grow">
                      <p className="font-medium">Message:</p>
                      <p className="text-sm line-clamp-2">{appointment.message}</p>
                    </div>
                  )}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleCompleteWithConfirmation(appointment._id)}
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
  );
};

export default AppointmentsSection; 