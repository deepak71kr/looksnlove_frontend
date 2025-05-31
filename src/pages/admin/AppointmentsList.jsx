import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope, FaCheck, FaTimes, FaTrash, FaSync } from 'react-icons/fa';

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/messages/admin/messages');
      setAppointments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/messages/${id}`, { status: newStatus });
      fetchAppointments();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const deleteAppointment = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`http://localhost:5000/api/messages/${id}`);
        fetchAppointments();
      } catch (err) {
        console.error('Error deleting appointment:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Appointments</h1>
        <button
          onClick={fetchAppointments}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          <FaSync /> Refresh
        </button>
      </div>

      <div className="grid gap-6">
        {appointments.map((appointment) => (
          <div
            key={appointment._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaUser className="text-primary" />
                  <span className="font-semibold">{appointment.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-primary" />
                  <span>{appointment.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-primary" />
                  <span>{formatDate(appointment.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-primary" />
                  <span>{appointment.time}</span>
                </div>
                {appointment.message && (
                  <div className="flex items-start gap-2">
                    <FaEnvelope className="text-primary mt-1" />
                    <span className="text-gray-600">{appointment.message}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
                <div className="flex gap-2">
                  {appointment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(appointment._id, 'confirmed')}
                        className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                      >
                        <FaCheck /> Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(appointment._id, 'cancelled')}
                        className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                      >
                        <FaTimes /> Cancel
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => deleteAppointment(appointment._id)}
                    className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {appointments.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No appointments found
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsList; 