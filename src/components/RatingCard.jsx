import React, { useEffect, useState } from "react";
import { Star, Luggage, Gem, HeartHandshake, Sparkles } from "lucide-react";
import axios from 'axios';

const RatingCard = () => {
  const [stats, setStats] = useState({
    rating: 4.8,
    services: 200,
    experience: 3,
    members: 12
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/home-stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching home stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="relative bg-gradient-to-r from-pink-50 via-white to-pink-50 w-full py-8 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-pink-200 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-pink-300 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-100 rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Magazine Title */}
      <div className="text-center mb-8 relative">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
          <span className="text-pink-600">LOOKS</span>NLOVE
        </h2>
        <p className="text-lg text-gray-600 italic">Your Beauty Journey Starts Here</p>
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Sparkles className="w-8 h-8 text-pink-500 animate-pulse" />
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {/* Rating */}
          <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-pink-100">
            <div className="relative">
              <Star className="w-12 h-12 text-pink-500 mb-2" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">★</span>
              </div>
            </div>
            <p className="text-4xl font-extrabold text-gray-800 mb-1">{stats.rating}/5</p>
            <p className="text-pink-600 font-bold text-lg">Rating</p>
          </div>

          {/* Services */}
          <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-pink-100">
            <div className="relative">
              <Luggage className="w-12 h-12 text-pink-500 mb-2" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">+</span>
              </div>
            </div>
            <p className="text-4xl font-extrabold text-gray-800 mb-1">{stats.services}+</p>
            <p className="text-pink-600 font-bold text-lg">Services</p>
          </div>

          {/* Experience */}
          <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-pink-100">
            <div className="relative">
              <Gem className="w-12 h-12 text-pink-500 mb-2" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✨</span>
              </div>
            </div>
            <p className="text-4xl font-extrabold text-gray-800 mb-1">{stats.experience}+ yrs</p>
            <p className="text-pink-600 font-bold text-lg">Experience</p>
          </div>

          {/* Members */}
          <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border border-pink-100">
            <div className="relative">
              <HeartHandshake className="w-12 h-12 text-pink-500 mb-2" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">❤</span>
              </div>
            </div>
            <p className="text-4xl font-extrabold text-gray-800 mb-1">{stats.members}+</p>
            <p className="text-pink-600 font-bold text-lg">Members</p>
          </div>
        </div>
      </div>

      {/* Magazine Tagline */}
      <div className="text-center mt-8 relative">
        <p className="text-xl text-gray-700 font-light italic">
          "Where Beauty Meets Excellence"
        </p>
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <Sparkles className="w-8 h-8 text-pink-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default RatingCard;
