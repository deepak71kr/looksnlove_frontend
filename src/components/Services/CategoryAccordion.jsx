// src/components/Services/CategoryAccordion.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './services.css';

const CategoryAccordion = ({ categories, initialOpenCategory = -1 }) => {
  const [openCategory, setOpenCategory] = useState(initialOpenCategory);
  const [heights, setHeights] = useState({});
  const contentRefs = useRef({});
  const defaultImage = '/categories_images/combo_services.jpg';
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadingItems, setLoadingItems] = useState({});
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Debug logs
  console.log('CategoryAccordion - initialOpenCategory:', initialOpenCategory);
  console.log('CategoryAccordion - current openCategory:', openCategory);

  // Effect to handle initial category opening
  useEffect(() => {
    console.log('Effect triggered - initialOpenCategory:', initialOpenCategory);
    if (initialOpenCategory !== -1) {
      console.log('Setting open category to:', initialOpenCategory);
      setOpenCategory(initialOpenCategory);
      setIsTransitioning(true);
      
      // Set the height for the initially opened category
      setTimeout(() => {
        if (contentRefs.current[initialOpenCategory]) {
          console.log('Setting height for category:', initialOpenCategory);
          setHeights(prev => ({
            ...prev,
            [initialOpenCategory]: contentRefs.current[initialOpenCategory].scrollHeight
          }));
        }
        setIsTransitioning(false);
      }, 100);
    }
  }, [initialOpenCategory]);

  const handleImageError = (e) => {
    // If we're not already using the default image, use it
    if (!e.target.src.includes(defaultImage)) {
      e.target.src = defaultImage;
    }
  };

  const getImagePath = (imagePath) => {
    if (!imagePath) return defaultImage;
    // If the path starts with /, it's already absolute
    if (imagePath.startsWith('/')) return imagePath;
    // Otherwise, prepend /categories_images/
    return `/categories_images/${imagePath}`;
  };

  const toggleCategory = (index) => {
    if (isTransitioning) return;
    
    console.log('Toggling category:', index);
    setIsTransitioning(true);
    setOpenCategory(prev => prev === index ? null : index);

    setTimeout(() => {
      if (contentRefs.current[index]) {
        setHeights(prev => ({
          ...prev,
          [index]: contentRefs.current[index].scrollHeight
        }));
      }
      setIsTransitioning(false);
    }, 700);
  };

  const handleAddToCart = async (service) => {
    try {
      setLoadingItems(prev => ({ ...prev, [service._id]: true }));
      
      const success = await addToCart({
        _id: service._id,
        name: service.name,
        price: service.price || (service.prices && service.prices[0]) || 0,
        images: service.images
      });

      if (success) {
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
        notification.textContent = 'Service added to cart!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.remove();
        }, 2000);
      } else {
        // Show error notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
        notification.textContent = 'Please login to add items to cart';
        document.body.appendChild(notification);
        
        setTimeout(() => {
          notification.remove();
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      notification.textContent = error.message || 'Failed to add service to cart';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 2000);
    } finally {
      setLoadingItems(prev => ({ ...prev, [service._id]: false }));
    }
  };

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center text-gray-600">
        No categories available
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Our Services</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {categories.map((category, index) => {
          const isOpen = openCategory === index;
          const rowIndex = Math.floor(index / 2);
          const isEvenRow = rowIndex % 2 === 0;

          console.log(`Category ${index} (${category.category}) isOpen:`, isOpen);

          return (
            <div 
              key={index} 
              className={`accordion-item transition-all duration-700 ease-in-out transform ${
                isOpen ? 'lg:col-span-2 scale-[1.02]' : 'scale-100'
              }`}
              style={{
                gridRow: isOpen ? `${rowIndex + 1} / span 2` : 'auto',
                marginBottom: isOpen ? '1.5rem' : '0',
                width: '100%',
                position: 'relative',
                zIndex: isOpen ? 10 : 1,
                gridColumn: isOpen ? '1 / -1' : 'auto'
              }}
            >
              <div className="flex items-center bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-700 w-full">
                {/* Accordion Button */}
                <button
                  onClick={() => toggleCategory(index)}
                  className="flex-1 flex items-center justify-between p-4 sm:p-6 text-left hover:bg-gray-50 transition-all duration-700"
                  disabled={isTransitioning}
                >
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 transition-colors duration-700 group-hover:text-pink-600">
                      {category.category}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {category.subcategories?.length || 0} services available
                    </p>
                  </div>
                  <ChevronDownIcon
                    size={24}
                    className={`transform transition-transform duration-700 ease-in-out ${
                      isOpen ? 'rotate-180 text-pink-600' : 'text-gray-500'
                    }`}
                  />
                </button>

                {/* Category Image */}
                <div className="w-32 sm:w-48 h-32 sm:h-48 flex-shrink-0 relative overflow-hidden">
                  <img
                    src={getImagePath(category.image)}
                    alt={category.category}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    onError={handleImageError}
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Services List */}
              <div 
                ref={el => contentRefs.current[index] = el}
                className={`overflow-hidden transition-all duration-700 ease-in-out w-full ${
                  isOpen ? 'max-h-[2000px] opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}
                style={{
                  position: 'relative',
                  zIndex: isOpen ? 20 : 1,
                  maxHeight: isOpen ? heights[index] : 0
                }}
              >
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 relative z-20 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {category.subcategories?.map((service, serviceIndex) => (
                      <div
                        key={serviceIndex}
                        className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-700 transform hover:scale-[1.02] hover:shadow-md"
                      >
                        <div>
                          <h4 className="text-base sm:text-lg font-medium text-gray-800 transition-colors duration-700 group-hover:text-pink-600">
                            {service.name}
                          </h4>
                          {service.prices && service.prices.length > 0 && (
                            <p className="text-pink-600 font-semibold mt-1">
                              ₹{service.prices[0]}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddToCart(service)}
                          disabled={loadingItems[service._id]}
                          className="px-3 sm:px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-all duration-700 transform hover:scale-105 hover:shadow-md text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          {loadingItems[service._id] ? (
                            <Loader2 className="animate-spin" size={20} />
                          ) : (
                            'Add to Cart'
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryAccordion;
