import React, { memo, useState } from 'react';
import { X, Check } from 'lucide-react';

const ServiceCard = memo(({ service, onAddToCart }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAdding(true);
    await onAddToCart(service);
    setTimeout(() => setIsAdding(false), 1500); // Reset after animation
  };

  return (
    <div 
      data-aos="fade-up"
      data-aos-duration="400"
      className="group bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-200 ease-out will-change-transform"
    >
      <div className="flex flex-col h-full">
        <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors duration-200">
          {service.name}
        </h4>
        <p className="text-sm text-gray-600 mb-3 flex-grow min-h-[2.5rem] line-clamp-2">
          {service.description || 'No description available'}
        </p>
        <div className="mt-auto pt-3 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-pink-600">₹{service.price || 0}</span>
              <span className="text-xs text-gray-500">per service</span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`
                relative bg-pink-600 text-white px-4 py-1.5 text-sm rounded-md 
                transition-all duration-300 ease-out transform 
                ${isAdding ? 'bg-green-500 scale-95' : 'hover:bg-pink-700 hover:scale-105 hover:shadow-md'} 
                will-change-transform whitespace-nowrap overflow-hidden
              `}
            >
              <span className={`flex items-center transition-transform duration-300 ${isAdding ? '-translate-y-6' : 'translate-y-0'}`}>
                Add to Cart
              </span>
              <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${isAdding ? 'translate-y-0' : 'translate-y-6'}`}>
                <Check size={16} className="mr-1" />
                Added!
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ServiceCard.displayName = 'ServiceCard';

const CategoryExpanded = memo(({ category, onClose, onAddToCart }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-200 ease-out"
    >
      <div 
        data-aos="fade-up"
        data-aos-duration="400"
        className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-200 ease-out will-change-transform"
      >
        {/* Header with category image */}
        <div className="relative h-48 bg-gray-100">
          <img
            src={category.image}
            alt={category.category}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/categories_images/default-category.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            <h2 className="text-2xl font-bold text-white mb-1">{category.category}</h2>
            <p className="text-sm text-white/90">
              {category.subcategories?.length || 0} premium services available
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-all duration-200 ease-out transform hover:scale-110 hover:rotate-90 will-change-transform"
          >
            <X size={20} />
          </button>
        </div>

        {/* Services Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-12rem)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.subcategories?.map((service) => (
              <ServiceCard
                key={`${category.category}-${service.name}-${service.price}`}
                service={service}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

CategoryExpanded.displayName = 'CategoryExpanded';

export default CategoryExpanded; 