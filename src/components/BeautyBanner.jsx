import React from "react";
import { useNavigate } from 'react-router-dom';

const BeautyBanner = () => {
  const navigate = useNavigate();

  const scrollToFooter = (e) => {
    e.preventDefault();
    const footer = document.getElementById('foot');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#foot');
    }
  };

  return (
    <div
      className="w-full h-[60vh] lg:h-[80vh] flex flex-row items-center text-black px-4 lg:px-16 bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/beauty-banner.png')",
        backgroundColor: "#ffe5ef", // Fallback color
      }}
    >
      {/* Dark overlay for better text visibility on mobile */}
      <div className="absolute inset-0 bg-black/40 lg:bg-transparent"></div>
      
      {/* Content */}
      <div className="w-full md:w-[40%] ml-auto pl-6 lg:pl-12 relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold text-left text-white lg:text-gray-800">Master of Beauty</h1>
        <p className="text-sm md:text-lg mt-2 text-left text-white lg:text-gray-700">
          Professional and high-quality beauty care in Jamshedpur
        </p>
        <button 
          onClick={scrollToFooter}
          className="mt-6 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white text-lg font-semibold rounded-full shadow-lg transition duration-300"
        >
          Book an Appointment
        </button>
      </div>
    </div>
  );
};

export default BeautyBanner;