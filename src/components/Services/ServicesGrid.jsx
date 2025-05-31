import React from 'react';
import { Link } from 'react-router-dom';

const ServicesGrid = ({ categories }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Category Image */}
            <div className="relative h-48">
              <img
                src={category.image}
                alt={category.category}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white">{category.category}</h3>
              </div>
            </div>

            {/* Services List */}
            <div className="p-6">
              <div className="space-y-4">
                {category.subcategories.map((service, serviceIndex) => (
                  <div key={serviceIndex} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{service.name}</h4>
                        {service.prices && service.prices.length > 0 && (
                          <p className="text-pink-600 font-medium">
                            ${service.prices[0]}
                          </p>
                        )}
                      </div>
                      <Link
                        to="/cart"
                        className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
                      >
                        Add to Cart
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesGrid; 