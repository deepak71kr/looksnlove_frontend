// src/components/Services/ServiceItem.jsx
import React from 'react';

const ServiceItem = ({ service }) => (
  <div className="service-item">
    <span className="service-name">{service.name}</span>
    <div className="price-buttons">
      {service.prices && service.prices.length > 0 ? (
        service.prices.map((price, index) => (
          <button 
            key={`${service.name}-price-${index}`} 
            className="price-btn"
            onClick={() => {
              // TODO: Add to cart functionality
              console.log('Add to cart:', service.name, price);
            }}
          >
            <span className="inr">₹</span>
            {price}
            <span className="add-icon">+</span>
          </button>
        ))
      ) : (
        <span className="no-price">Price not available</span>
      )}
    </div>
  </div>
);

export default ServiceItem;
