import React, { useState, useEffect } from 'react';
import { Star, Sparkles, Gem, HeartHandshake } from 'lucide-react';

const RatingStats = () => {
  const [stats, setStats] = useState({
    rating: 4.8,
    services: 200,
    experience: 3,
    members: 12
  });

  // This would be replaced with actual API call
  useEffect(() => {
    // Fetch stats from backend
    // setStats(data);
  }, []);

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Rating */}
          <div className="flex flex-col items-center p-6 bg-pink-50 rounded-xl">
            <Star className="h-12 w-12 text-pink-500 mb-4" strokeWidth={1.5} />
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {stats.rating}
              <span className="text-gray-500 text-2xl">/5</span>
            </div>
            <p className="text-gray-600 font-medium">Rating</p>
          </div>

          {/* Services */}
          <div className="flex flex-col items-center p-6 bg-pink-50 rounded-xl">
            <Sparkles className="h-12 w-12 text-pink-500 mb-4" strokeWidth={1.5} />
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {stats.services}+
            </div>
            <p className="text-gray-600 font-medium">Services</p>
          </div>

          {/* Experience */}
          <div className="flex flex-col items-center p-6 bg-pink-50 rounded-xl">
            <Gem className="h-12 w-12 text-pink-500 mb-4" strokeWidth={1.5} />
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {stats.experience}+
            </div>
            <p className="text-gray-600 font-medium">Years Experience</p>
          </div>

          {/* Members */}
          <div className="flex flex-col items-center p-6 bg-pink-50 rounded-xl">
            <HeartHandshake className="h-12 w-12 text-pink-500 mb-4" strokeWidth={1.5} />
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {stats.members}+
            </div>
            <p className="text-gray-600 font-medium">Team Members</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingStats; 