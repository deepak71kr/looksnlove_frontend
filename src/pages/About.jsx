import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-primary/20 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-primary">About Us</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Our Story</h2>
        <p className="text-gray-600 mb-4">
          Welcome to Looks N Love, your premier destination for beauty and wellness services. 
          We are dedicated to providing exceptional beauty services that enhance your natural beauty 
          and boost your confidence.
        </p>
        <p className="text-gray-600 mb-4">
          Our team of experienced professionals is committed to delivering personalized services 
          that meet your unique needs and preferences. We use only the highest quality products 
          and stay up-to-date with the latest beauty trends and techniques.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Our Mission</h2>
        <p className="text-gray-600 mb-4">
          At Looks N Love, our mission is to help you look and feel your best. We believe that 
          everyone deserves to feel confident and beautiful in their own skin. Our services are 
          designed to enhance your natural beauty and provide you with a relaxing, enjoyable experience.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Why Choose Us?</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Experienced and professional staff</li>
          <li>High-quality products and services</li>
          <li>Personalized attention and care</li>
          <li>Clean and comfortable environment</li>
          <li>Competitive pricing</li>
          <li>Convenient location and flexible hours</li>
        </ul>
      </div>
    </div>
  );
};

export default About; 