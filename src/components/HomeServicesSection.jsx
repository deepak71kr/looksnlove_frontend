import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { fetchServicesData } from './Services/servicesData';
import { useCart } from '../context/CartContext';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Lazy load components
const CategoryCard = lazy(() => import('./Services/CategoryCard'));
const CategoryExpanded = lazy(() => import('./Services/CategoryExpanded'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-pink-200 rounded-full animate-spin border-t-pink-600"></div>
      <div className="w-16 h-16 border-4 border-pink-100 rounded-full animate-spin border-t-pink-400 absolute top-0 left-0 animate-pulse"></div>
    </div>
  </div>
);

const HomeServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      disable: 'mobile',
      startEvent: 'DOMContentLoaded',
      offset: 50,
      delay: 0,
      easing: 'ease-out-cubic',
      mirror: false,
      anchorPlacement: 'top-bottom',
    });

    const loadServices = async () => {
      try {
        setLoading(true);
        const data = await fetchServicesData();
        
        if (!data || data.length === 0) {
          setError('No services available at the moment.');
        } else {
          setServices(data);
        }
      } catch (err) {
        setError('Failed to load services. Please try again later.');
        console.error('Error loading services:', err);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const handleAddToCart = async (service) => {
    try {
      const cartItem = {
        serviceName: service.name,
        category: selectedCategory.category,
        price: service.price,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })
      };
      
      await addToCart(cartItem);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      notification.textContent = 'Service added to cart!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 2000);
    } catch (error) {
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      notification.textContent = error.message || 'Failed to add service to cart';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 2000);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
        <div className="text-center p-8 rounded-2xl bg-white shadow-xl">
          <div className="text-6xl mb-4">😔</div>
          <div className="text-2xl text-red-600 font-medium">{error}</div>
        </div>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
        <div className="text-center p-8 rounded-2xl bg-white shadow-xl">
          <div className="text-6xl mb-4">🔍</div>
          <div className="text-2xl text-gray-600 font-medium">No services available at the moment.</div>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full py-16 bg-gradient-to-br from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 
            data-aos="fade-down"
            data-aos-duration="500"
            className="text-4xl font-bold text-gray-800 mb-4"
          >
            Our Services
          </h2>
          <p 
            data-aos="fade-up"
            data-aos-duration="500"
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Discover our range of premium services designed to enhance your experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Suspense fallback={<LoadingSpinner />}>
            {services.map((category, index) => (
              <CategoryCard
                key={index}
                category={category}
                index={index}
                onClick={() => setSelectedCategory(category)}
              />
            ))}
          </Suspense>
        </div>

        {selectedCategory && (
          <Suspense fallback={<LoadingSpinner />}>
            <CategoryExpanded
              category={selectedCategory}
              onClose={() => setSelectedCategory(null)}
              onAddToCart={handleAddToCart}
            />
          </Suspense>
        )}

        <div className="mt-12 text-center">
          <Link
            to="/services"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeServicesSection; 