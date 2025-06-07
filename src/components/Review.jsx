// POST /api/cart/add
router.post('/add', auth, addToCart);import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import "tailwindcss/tailwind.css";

const reviews = [
  {
    name: "Priya Sharma",
    location: "Bistupur",
    rating: 5,
    review: "The best beauty service I've ever experienced! The staff is incredibly professional and the results are always amazing.",
    date: "2 weeks ago"
  },
  {
    name: "Anjali Patel",
    location: "Sakchi",
    rating: 5,
    review: "Regular customer here! Their home service is a game-changer. Always punctual and the quality is consistently excellent.",
    date: "1 month ago"
  },
  {
    name: "Riya Singh",
    location: "Telco Colony",
    rating: 4,
    review: "I've been a loyal customer for over a year. Their attention to detail and personalized service is unmatched.",
    date: "3 weeks ago"
  },
  {
    name: "Meera Gupta",
    location: "Kadma",
    rating: 5,
    review: "The convenience of at-home service combined with salon-quality results is unbeatable. Highly recommend!",
    date: "2 months ago"
  },
  {
    name: "Sneha Verma",
    location: "Sonari",
    rating: 5,
    review: "Professional, punctual, and perfect results every time. They've transformed my beauty routine completely.",
    date: "1 week ago"
  },
  {
    name: "Pooja Mishra",
    location: "Golmuri",
    rating: 4,
    review: "Their bridal packages are exceptional! Made my special day even more beautiful with their expert services.",
    date: "2 months ago"
  },
  {
    name: "Neha Kumari",
    location: "Adityapur",
    rating: 5,
    review: "The team is so friendly and skilled. They always understand exactly what I want and deliver beyond expectations.",
    date: "3 weeks ago"
  }
];

const Review = () => {
  const totalReviews = reviews.length;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % totalReviews);
    }, 3000);
    return () => clearInterval(interval);
  }, [totalReviews]);

  const getVisibleReviews = () => {
    const firstIndex = index % totalReviews;
    return Array.from(
      { length: 3 },
      (_, i) => reviews[(firstIndex + i) % totalReviews]
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center bg-customPink py-10">
      <h2 className="text-4xl font-bold text-black mb-6">Customer Reviews</h2>
      <div className="overflow-hidden relative max-w-6xl w-full px-4">
        <div className="flex justify-center items-center transition-transform duration-500 ease-in-out">
          {getVisibleReviews().map((review, i) => (
            <div
              key={i}
              className="w-80 bg-white text-black rounded-2xl shadow-lg p-6 mx-4"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-pink-600 font-semibold text-lg">
                    {review.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{review.name}</h3>
                  <p className="text-sm text-gray-500">{review.location}</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
                {[...Array(5 - review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-gray-300" />
                ))}
              </div>
              <p className="text-gray-600 mb-3">{review.review}</p>
              <p className="text-sm text-gray-500">{review.date}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        {reviews.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === index % totalReviews ? "bg-black scale-110" : "bg-gray-400"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Review;
