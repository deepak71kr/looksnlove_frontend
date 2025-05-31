import React, { memo } from 'react';
import { ChevronRight } from 'lucide-react';

const CategoryCard = memo(({ category, onClick, index }) => {
  return (
    <div 
      data-aos="fade-up"
      data-aos-duration="400"
      data-aos-delay={index * 50}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-200 ease-out transform hover:-translate-y-1 cursor-pointer will-change-transform"
      onClick={onClick}
    >
      <div className="relative">
        {/* Category Image */}
        <div className="h-48 relative overflow-hidden">
          <img
            src={category.image}
            alt={category.category}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 will-change-transform"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/categories_images/default-category.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Category Info */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors duration-200">
            {category.category}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {category.subcategories?.length || 0} premium services available
          </p>
          <div className="flex items-center text-pink-600 transition-all duration-200 group-hover:translate-x-2">
            <span className="text-sm font-medium">Explore Services</span>
            <ChevronRight size={18} className="ml-1 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>
    </div>
  );
});

CategoryCard.displayName = 'CategoryCard';

export default CategoryCard; 