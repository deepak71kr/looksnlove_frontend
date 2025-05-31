import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import './HappyFaces.css';

const HappyFaces = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);

  const reviews = [
    {
      name: "Priya Sharma",
      location: "Bistupur",
      rating: 5,
      comment: "The best beauty service I've ever experienced! The staff is incredibly professional and the results are always amazing."
    },
    {
      name: "Anjali Patel",
      location: "Sakchi",
      rating: 5,
      comment: "Regular customer here! Their home service is a game-changer. Always punctual and the quality is consistently excellent."
    },
    {
      name: "Riya Singh",
      location: "Telco Colony",
      rating: 5,
      comment: "I've been a loyal customer for over a year. Their attention to detail and personalized service is unmatched."
    },
    {
      name: "Meera Gupta",
      location: "Kadma",
      rating: 5,
      comment: "The convenience of at-home service combined with salon-quality results is unbeatable. Highly recommend!"
    },
    {
      name: "Sneha Verma",
      location: "Sonari",
      rating: 5,
      comment: "Professional, punctual, and perfect results every time. They've transformed my beauty routine completely."
    },
    {
      name: "Pooja Mishra",
      location: "Golmuri",
      rating: 5,
      comment: "Their bridal packages are exceptional! Made my special day even more beautiful with their expert services."
    },
    {
      name: "Neha Kumari",
      location: "Adityapur",
      rating: 5,
      comment: "The team is so friendly and skilled. They always understand exactly what I want and deliver beyond expectations."
    },
    {
      name: "Shweta Roy",
      location: "Mango",
      rating: 5,
      comment: "Best beauty service in Jamshedpur! Their home service has saved me so much time and the results are always perfect."
    },
    {
      name: "Kriti Singh",
      location: "Baridih",
      rating: 5,
      comment: "I love how they bring the salon experience to my home. The quality and professionalism are outstanding."
    },
    {
      name: "Ananya Das",
      location: "Bistupur",
      rating: 5,
      comment: "Their attention to detail and customer service is remarkable. Always a pleasure to book their services."
    },
    {
      name: "Ritika Sharma",
      location: "Sakchi",
      rating: 5,
      comment: "The convenience of their service combined with the quality is unbeatable. My go-to beauty service!"
    },
    {
      name: "Divya Patel",
      location: "Telco Colony",
      rating: 5,
      comment: "Professional, friendly, and always delivers excellent results. Highly recommend their services!"
    },
    {
      name: "Tanvi Gupta",
      location: "Kadma",
      rating: 5,
      comment: "Their home service has made beauty treatments so much more convenient. The quality is consistently excellent."
    },
    {
      name: "Aisha Khan",
      location: "Sonari",
      rating: 5,
      comment: "The team is incredibly skilled and professional. They always make me feel beautiful and confident."
    },
    {
      name: "Zara Ahmed",
      location: "Golmuri",
      rating: 5,
      comment: "Best beauty service in town! Their attention to detail and customer care is exceptional."
    },
    {
      name: "Nisha Kumari",
      location: "Adityapur",
      rating: 5,
      comment: "Regular customer here! Their service quality and professionalism are consistently outstanding."
    },
    {
      name: "Maya Roy",
      location: "Mango",
      rating: 5,
      comment: "Love their home service! The convenience and quality make them my favorite beauty service provider."
    },
    {
      name: "Sanya Singh",
      location: "Baridih",
      rating: 5,
      comment: "Their bridal packages are amazing! Made my wedding day even more special with their expert services."
    },
    {
      name: "Isha Das",
      location: "Bistupur",
      rating: 5,
      comment: "The team is so friendly and skilled. They always understand exactly what I want and deliver perfect results."
    },
    {
      name: "Riya Patel",
      location: "Sakchi",
      rating: 5,
      comment: "Best beauty service in Jamshedpur! Their home service has transformed my beauty routine completely."
    }
  ];

  return (
    <div className="bg-gradient-to-br from-pink-50 to-purple-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-12 text-center font-poppins" data-aos="fade-up">
            Happy <span className="text-pink-500">Faces</span>
          </h2>
          
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex space-x-6 animate-scroll">
                {reviews.map((review, index) => (
                  <div 
                    key={index}
                    className="flex-none w-80 bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
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
                    <div className="flex mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="absolute top-1/2 -left-4 transform -translate-y-1/2">
              <button className="bg-white rounded-full p-2 shadow-lg hover:bg-pink-50 transition-colors">
                <ChevronLeft className="w-6 h-6 text-pink-600" />
              </button>
            </div>
            
            <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
              <button className="bg-white rounded-full p-2 shadow-lg hover:bg-pink-50 transition-colors">
                <ChevronRight className="w-6 h-6 text-pink-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HappyFaces; 