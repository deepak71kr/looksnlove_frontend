// src/components/Services/CategoryDetails.jsx
import React from 'react';
import ServiceItem from './ServiceItem';

const CategoryDetails = ({ category }) => (
  <div className="category-details">
    <div className="category-header">
      <h2>{category.category}</h2>
      <img 
        src={`/images/${category.image}`} 
        alt={`${category.category} services`} 
        className="category-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/images/default-category.jpg';
        }}
      />
    </div>
    <div className="services-list">
      {category.subcategories.length === 0 ? (
        <div className="no-services">No services available in this category</div>
      ) : (
        category.subcategories.map((service, index) => (
          <ServiceItem 
            key={`${category.category}-${service.name}-${index}`} 
            service={service} 
          />
        ))
      )}
    </div>
  </div>
);

export default CategoryDetails;
