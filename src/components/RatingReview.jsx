import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RatingReview = () => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const ratingDescriptions = {
    1: 'Bad',
    2: 'Okay',
    3: 'Good',
    4: 'Best',
    5: 'Outstanding'
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would submit the rating and review to the backend
    // The admin would then review and approve it
    console.log({ rating, review });
  };

  return (
    <div className="bg-white py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-pink-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Rate Your Experience</h2>
          
          {/* Rating Stars */}
          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleRatingClick(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-10 h-10 transition-colors duration-200 ${
                      value <= (hoveredRating || rating)
                        ? 'text-pink-500'
                        : 'text-gray-300'
                    }`}
                    fill={value <= (hoveredRating || rating) ? 'currentColor' : 'none'}
                  />
                </button>
              ))}
            </div>
            {(hoveredRating || rating) > 0 && (
              <p className="text-center text-gray-600 font-medium">
                {ratingDescriptions[hoveredRating || rating]}
              </p>
            )}
          </div>

          {/* Review Text Area */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="review" className="block text-gray-700 font-medium mb-2">
                Write Your Review
              </label>
              <textarea
                id="review"
                rows="4"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                placeholder="Share your experience with us..."
              />
            </div>

            <button
              type="submit"
              disabled={!rating}
              className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-pink-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Review
            </button>
          </form>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Note: Your review will be reviewed by our team before being published.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RatingReview; 