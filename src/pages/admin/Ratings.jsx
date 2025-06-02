import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Luggage, Gem, HeartHandshake, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Ratings = () => {
  const [stats, setStats] = useState({
    rating: 4.8,
    services: 200,
    experience: 3,
    members: 12
  });
  const [tempStats, setTempStats] = useState({
    rating: 4.8,
    services: 200,
    experience: 3,
    members: 12
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/home-stats', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setStats(response.data);
      setTempStats(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setTempStats(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put('/api/home-stats', 
        tempStats,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setStats(response.data);
      setSuccessMessage('Statistics updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error updating stats:', error);
      setError(error.response?.data?.message || 'Failed to update statistics');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Home Statistics</h1>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 bg-pink-100 text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-200 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Rating */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center mb-4">
            <Star size={40} className="text-pink-500 mb-2" strokeWidth={1.5} />
            <h3 className="text-lg font-semibold text-gray-800">Rating</h3>
          </div>
          <div className="flex items-center justify-center gap-2">
            <input
              type="number"
              value={tempStats.rating}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (value >= 0 && value <= 5) {
                  handleInputChange('rating', value);
                }
              }}
              min="0"
              max="5"
              step="0.1"
              className="w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
            <span className="text-gray-600">/5</span>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center mb-4">
            <Luggage size={40} className="text-pink-500 mb-2" strokeWidth={1.5} />
            <h3 className="text-lg font-semibold text-gray-800">Services</h3>
          </div>
          <div className="flex items-center justify-center gap-2">
            <input
              type="number"
              value={tempStats.services}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= 0) {
                  handleInputChange('services', value);
                }
              }}
              min="0"
              className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
            <span className="text-gray-600">+</span>
          </div>
        </div>

        {/* Experience */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center mb-4">
            <Gem size={40} className="text-pink-500 mb-2" strokeWidth={1.5} />
            <h3 className="text-lg font-semibold text-gray-800">Experience</h3>
          </div>
          <div className="flex items-center justify-center gap-2">
            <input
              type="number"
              value={tempStats.experience}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= 0) {
                  handleInputChange('experience', value);
                }
              }}
              min="0"
              className="w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
            <span className="text-gray-600">+ years</span>
          </div>
        </div>

        {/* Members */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center mb-4">
            <HeartHandshake size={40} className="text-pink-500 mb-2" strokeWidth={1.5} />
            <h3 className="text-lg font-semibold text-gray-800">Members</h3>
          </div>
          <div className="flex items-center justify-center gap-2">
            <input
              type="number"
              value={tempStats.members}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= 0) {
                  handleInputChange('members', value);
                }
              }}
              min="0"
              className="w-20 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
            <span className="text-gray-600">+</span>
          </div>
        </div>
      </div>

      {/* Save Button above Preview, right aligned */}
      <div className="flex justify-end mt-10 mb-4" data-aos="fade-left">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-pink-500 text-white px-8 py-3 rounded-full shadow-lg hover:bg-pink-600 transition-colors text-lg font-semibold"
        >
          <Save size={22} />
          Save Changes
        </button>
      </div>

      {/* Preview Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Preview</h2>
        <div className="bg-customPink p-10 px-5 flex justify-center gap-x-40 text-center text-black">
          {/* Rating */}
          <div className="flex flex-col items-center">
            <Star size={40} strokeWidth={1.5} />
            <p className="text-xl font-semibold">{tempStats.rating}/5</p>
            <p className="text-green-700 text-lg">Rating</p>
          </div>

          {/* Services */}
          <div className="flex flex-col items-center">
            <Luggage size={40} strokeWidth={1.5} />
            <p className="text-xl font-semibold">{tempStats.services}+</p>
            <p className="text-green-700 text-lg">Services</p>
          </div>

          {/* Experience */}
          <div className="flex flex-col items-center">
            <Gem size={40} strokeWidth={1.5} />
            <p className="text-xl font-semibold">{tempStats.experience}+ yrs</p>
            <p className="text-green-700 text-lg">Experience</p>
          </div>

          {/* Members */}
          <div className="flex flex-col items-center">
            <HeartHandshake size={40} strokeWidth={1.5} />
            <p className="text-xl font-semibold">{tempStats.members}+</p>
            <p className="text-green-700 text-lg">Members</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ratings; 