import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PackageCategories = ({ onAddToCart }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  const packages = [
    {
      id: 'combo',
      name: 'Combo Package',
      description: 'Choose any 4 services',
      maxServices: 4,
      services: [
        { id: 1, name: 'Haircut & Styling', price: 1500 },
        { id: 2, name: 'Facial', price: 2000 },
        { id: 3, name: 'Manicure', price: 800 },
        { id: 4, name: 'Pedicure', price: 1000 },
        { id: 5, name: 'Hair Color', price: 2500 },
        { id: 6, name: 'Hair Treatment', price: 1800 },
        { id: 7, name: 'Makeup', price: 3000 },
        { id: 8, name: 'Waxing', price: 1200 }
      ]
    },
    {
      id: 'basic',
      name: 'Basic Package',
      description: 'Choose any 4 services',
      maxServices: 4,
      services: [
        { id: 1, name: 'Haircut', price: 800 },
        { id: 2, name: 'Basic Facial', price: 1200 },
        { id: 3, name: 'Basic Manicure', price: 500 },
        { id: 4, name: 'Basic Pedicure', price: 600 },
        { id: 5, name: 'Hair Wash', price: 400 },
        { id: 6, name: 'Basic Hair Treatment', price: 1000 },
        { id: 7, name: 'Basic Makeup', price: 1500 },
        { id: 8, name: 'Basic Waxing', price: 800 }
      ]
    },
    {
      id: 'regular',
      name: 'Regular Package',
      description: 'Choose any 4 services',
      maxServices: 4,
      services: [
        { id: 1, name: 'Premium Haircut', price: 1200 },
        { id: 2, name: 'Premium Facial', price: 1800 },
        { id: 3, name: 'Premium Manicure', price: 700 },
        { id: 4, name: 'Premium Pedicure', price: 900 },
        { id: 5, name: 'Hair Color', price: 2000 },
        { id: 6, name: 'Premium Hair Treatment', price: 1500 },
        { id: 7, name: 'Party Makeup', price: 2500 },
        { id: 8, name: 'Premium Waxing', price: 1000 }
      ]
    },
    {
      id: 'premium',
      name: 'Premium Package',
      description: 'Choose any 5 services',
      maxServices: 5,
      services: [
        { id: 1, name: 'Luxury Haircut', price: 2000 },
        { id: 2, name: 'Luxury Facial', price: 3000 },
        { id: 3, name: 'Luxury Manicure', price: 1200 },
        { id: 4, name: 'Luxury Pedicure', price: 1500 },
        { id: 5, name: 'Premium Hair Color', price: 3500 },
        { id: 6, name: 'Luxury Hair Treatment', price: 2500 },
        { id: 7, name: 'Bridal Makeup', price: 5000 },
        { id: 8, name: 'Luxury Waxing', price: 1800 }
      ]
    }
  ];

  const handlePackageSelect = (packageId) => {
    setSelectedPackage(packageId);
    setSelectedServices([]);
  };

  const handleServiceSelect = (service) => {
    const packageData = packages.find(p => p.id === selectedPackage);
    const isSelected = selectedServices.some(s => s.id === service.id);

    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      if (selectedServices.length < packageData.maxServices) {
        setSelectedServices([...selectedServices, service]);
      } else {
        // Show notification that max services reached
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
        notification.textContent = `You can only select ${packageData.maxServices} services for this package`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
      }
    }
  };

  const handleAddToCart = () => {
    if (selectedServices.length === 0) {
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
      notification.textContent = 'Please select services first';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
      return;
    }

    const packageData = packages.find(p => p.id === selectedPackage);
    const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);

    onAddToCart({
      packageName: packageData.name,
      services: selectedServices,
      totalPrice,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    });

    setSelectedPackage(null);
    setSelectedServices([]);
  };

  return (
    <div className="py-12 bg-gradient-to-br from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Special Packages
        </h2>
        
        {/* Package Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {packages.map((pkg) => (
            <motion.div
              key={pkg.id}
              whileHover={{ scale: 1.05 }}
              className={`relative rounded-full aspect-square flex items-center justify-center cursor-pointer
                ${selectedPackage === pkg.id 
                  ? 'bg-pink-500 text-white' 
                  : 'bg-white text-gray-800 hover:bg-pink-100'}`}
              onClick={() => handlePackageSelect(pkg.id)}
            >
              <div className="text-center p-6">
                <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                <p className="text-sm">{pkg.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected Package Services */}
        {selectedPackage && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {packages.find(p => p.id === selectedPackage).name}
              </h3>
              <button
                onClick={handleAddToCart}
                className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition-colors"
              >
                Add to Cart
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.find(p => p.id === selectedPackage).services.map((service) => (
                <motion.div
                  key={service.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg cursor-pointer border-2 transition-colors
                    ${selectedServices.some(s => s.id === service.id)
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-300'}`}
                  onClick={() => handleServiceSelect(service)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-800">{service.name}</h4>
                      <p className="text-sm text-gray-600">₹{service.price}</p>
                    </div>
                    {selectedServices.some(s => s.id === service.id) && (
                      <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-right">
              <p className="text-gray-600">
                Selected: {selectedServices.length} / {packages.find(p => p.id === selectedPackage).maxServices} services
              </p>
              {selectedServices.length > 0 && (
                <p className="text-xl font-bold text-gray-800 mt-2">
                  Total: ₹{selectedServices.reduce((sum, service) => sum + service.price, 0)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageCategories; 