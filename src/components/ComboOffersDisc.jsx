import React, { useEffect } from "react";
import { Star, Sparkles, Crown, Luggage, Gem, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ComboOffersDisc = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);

  const handleServiceClick = (category) => {
    console.log('Navigating to services with category:', category);
    navigate(`/services?category=${encodeURIComponent(category)}`);
  };

  const plans = [
    {
      title: "Basic",
      image: "/categories_images/basic_services.jpg",
      description: "Essential services for your basic needs",
      features: [
        "Haircut",
        "Facial",
        "Manicure"
      ],
      category: "Basic"
    },
    {
      title: "Regular",
      image: "/categories_images/regular_services.jpg",
      description: "Regular maintenance and care services",
      features: [
        "Haircut",
        "Facial",
        "Manicure",
        "Pedicure"
      ],
      category: "Regular"
    },
    {
      title: "Premium",
      image: "/categories_images/premium_services.jpg",
      description: "Premium services for complete transformation",
      features: [
        "Haircut",
        "Facial",
        "Manicure",
        "Pedicure",
        "Hair Spa"
      ],
      category: "Premium"
    },
    {
      title: "Combo",
      image: "/categories_images/combo_services.jpg",
      description: "Special combo packages for maximum value",
      features: [
        "Haircut",
        "Facial",
        "Manicure",
        "Pedicure",
        "Hair Spa",
        "Body Massage"
      ],
      category: "Combo"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 w-full min-w-full overflow-x-hidden">
      {/* Circular Images Section */}
      <div className="py-12 sm:py-16 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <h2 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12"
            data-aos="fade-down"
          >
            Our Service Tiers
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="group relative cursor-pointer"
                onClick={() => handleServiceClick(plan.category)}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="relative w-full aspect-square rounded-full overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                  <img
                    src={plan.image}
                    alt={plan.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ aspectRatio: '1/1', objectPosition: 'center' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-4 sm:pb-6">
                    <span className="text-white text-base sm:text-lg md:text-xl font-bold">{plan.title}</span>
                  </div>
                </div>
                {index === 2 && (
                  <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-yellow-400 rounded-full p-1.5 sm:p-2 animate-pulse">
                    <Crown className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rectangular Cards Section */}
      <div className="flex flex-col space-y-6 sm:space-y-8 py-8 sm:py-10 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col items-center space-y-6 sm:space-y-8">
          {/* First Card - Image on Left */}
          <div 
            className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-lg w-full max-w-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
            onClick={() => handleServiceClick(plans[0].category)}
            data-aos="fade-right"
          >
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white flex-shrink-0 shadow-md" style={{ aspectRatio: '1/1' }}>
              <img
                src={plans[0].image}
                alt={plans[0].title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                style={{ aspectRatio: '1/1', objectPosition: 'center' }}
              />
            </div>
            <div className="text-gray-800 flex-1 min-w-0 text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-bold">{plans[0].title}</h2>
              <p className="text-sm md:text-base mt-2">
                {plans[0].description}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Perfect for quick touch-ups and essential grooming needs. Includes basic services to keep you looking fresh and well-maintained.
              </p>
            </div>
          </div>

          {/* Second Card - Image on Right */}
          <div 
            className="flex flex-col sm:flex-row-reverse items-center space-y-4 sm:space-y-0 sm:space-x-6 space-x-reverse bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-lg w-full max-w-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
            onClick={() => handleServiceClick(plans[1].category)}
            data-aos="fade-left"
          >
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white flex-shrink-0 shadow-md" style={{ aspectRatio: '1/1' }}>
              <img
                src={plans[1].image}
                alt={plans[1].title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                style={{ aspectRatio: '1/1', objectPosition: 'center' }}
              />
            </div>
            <div className="text-gray-800 flex-1 min-w-0 text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-bold">{plans[1].title}</h2>
              <p className="text-sm md:text-base mt-2">
                {plans[1].description}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Comprehensive care package for regular maintenance. Ideal for those who want consistent grooming and beauty care services.
              </p>
            </div>
          </div>

          {/* Third Card - Image on Left */}
          <div 
            className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-lg w-full max-w-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
            onClick={() => handleServiceClick(plans[2].category)}
            data-aos="fade-right"
          >
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white flex-shrink-0 shadow-md" style={{ aspectRatio: '1/1' }}>
              <img
                src={plans[2].image}
                alt={plans[2].title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                style={{ aspectRatio: '1/1', objectPosition: 'center' }}
              />
            </div>
            <div className="text-gray-800 flex-1 min-w-0 text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-bold">{plans[2].title}</h2>
              <p className="text-sm md:text-base mt-2">
                {plans[2].description}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Luxury pampering experience with premium services. Perfect for special occasions or when you want to treat yourself to the best.
              </p>
            </div>
          </div>

          {/* Fourth Card - Image on Right */}
          <div 
            className="flex flex-col sm:flex-row-reverse items-center space-y-4 sm:space-y-0 sm:space-x-6 space-x-reverse bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-lg w-full max-w-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl cursor-pointer"
            onClick={() => handleServiceClick(plans[3].category)}
            data-aos="fade-left"
          >
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white flex-shrink-0 shadow-md" style={{ aspectRatio: '1/1' }}>
              <img
                src={plans[3].image}
                alt={plans[3].title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                style={{ aspectRatio: '1/1', objectPosition: 'center' }}
              />
            </div>
            <div className="text-gray-800 flex-1 min-w-0 text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-bold">{plans[3].title}</h2>
              <p className="text-sm md:text-base mt-2">
                {plans[3].description}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Ultimate value package combining all premium services. Best choice for complete transformation and maximum benefits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboOffersDisc;
