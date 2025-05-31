import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Save, Tag } from 'lucide-react';

const Discounts = () => {
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [selectedServices, setSelectedServices] = useState({
    all: false,
    categories: {
      hairCare: false,
      skinCare: false,
      nailCare: false
    },
    services: {
      haircut: false,
      coloring: false,
      facial: false,
      manicure: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchDiscounts();
  }, [user, navigate]);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/discounts', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data) {
        setDiscountPercentage(response.data.percentage);
        setValidUntil(response.data.validUntil);
        setSelectedServices(response.data.services);
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching discounts:', error);
      setError(error.response?.data?.message || 'Failed to fetch discounts');
    } finally {
      setLoading(false);
    }
  };

  // Handle select all services
  const handleSelectAll = (checked) => {
    setSelectedServices({
      all: checked,
      categories: {
        hairCare: checked,
        skinCare: checked,
        nailCare: checked
      },
      services: {
        haircut: checked,
        coloring: checked,
        facial: checked,
        manicure: checked
      }
    });
  };

  // Handle category selection
  const handleCategorySelect = (category, checked) => {
    const updatedServices = { ...selectedServices };
    updatedServices.categories[category] = checked;
    
    // Update all services under this category
    if (category === 'hairCare') {
      updatedServices.services.haircut = checked;
      updatedServices.services.coloring = checked;
    } else if (category === 'skinCare') {
      updatedServices.services.facial = checked;
    } else if (category === 'nailCare') {
      updatedServices.services.manicure = checked;
    }
    // Update 'all' state based on if all categories are selected
    updatedServices.all = Object.values(updatedServices.categories).every(value => value);
    setSelectedServices(updatedServices);
  };

  // Handle individual service selection
  const handleServiceSelect = (service, checked) => {
    const updatedServices = { ...selectedServices };
    updatedServices.services[service] = checked;
    // Update category state based on its services
    if (['haircut', 'coloring'].includes(service)) {
      updatedServices.categories.hairCare = 
        (service === 'haircut' ? checked : updatedServices.services.haircut) &&
        (service === 'coloring' ? checked : updatedServices.services.coloring);
    } else if (service === 'facial') {
      updatedServices.categories.skinCare = checked;
    } else if (service === 'manicure') {
      updatedServices.categories.nailCare = checked;
    }
    // Update 'all' state
    updatedServices.all = Object.values(updatedServices.categories).every(value => value);
    setSelectedServices(updatedServices);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axios.put('http://localhost:5000/api/discounts', 
        {
          percentage: discountPercentage,
          validUntil,
          services: selectedServices
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setSuccessMessage('Discount updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error updating discount:', error);
      setError(error.response?.data?.message || 'Failed to update discount');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Discounts</h1>
        <button
          onClick={fetchDiscounts}
          className="flex items-center gap-2 bg-pink-100 text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-200 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* Discount Percentage */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount Percentage</label>
            <input 
              type="number" 
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              placeholder="Enter discount percentage"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" 
            />
          </div>

          {/* Valid Until */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Valid Until</label>
            <input 
              type="date" 
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500" 
            />
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Select Services</label>
            
            {/* Select All */}
            <div className="mb-4">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="selectAll"
                  checked={selectedServices.all}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label htmlFor="selectAll" className="ml-2 block text-sm text-gray-700">
                  Select All Services
                </label>
              </div>
            </div>

            {/* Categories and Services */}
            <div className="space-y-4">
              {/* Hair Care */}
              <div className="pl-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="hairCare"
                    checked={selectedServices.categories.hairCare}
                    onChange={(e) => handleCategorySelect('hairCare', e.target.checked)}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hairCare" className="ml-2 block text-sm font-medium text-gray-700">
                    Hair Care
                  </label>
                </div>
                <div className="pl-6 mt-2 space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="haircut"
                      checked={selectedServices.services.haircut}
                      onChange={(e) => handleServiceSelect('haircut', e.target.checked)}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label htmlFor="haircut" className="ml-2 block text-sm text-gray-700">
                      Haircut
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="coloring"
                      checked={selectedServices.services.coloring}
                      onChange={(e) => handleServiceSelect('coloring', e.target.checked)}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label htmlFor="coloring" className="ml-2 block text-sm text-gray-700">
                      Hair Coloring
                    </label>
                  </div>
                </div>
              </div>

              {/* Skin Care */}
              <div className="pl-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="skinCare"
                    checked={selectedServices.categories.skinCare}
                    onChange={(e) => handleCategorySelect('skinCare', e.target.checked)}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="skinCare" className="ml-2 block text-sm font-medium text-gray-700">
                    Skin Care
                  </label>
                </div>
                <div className="pl-6 mt-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="facial"
                      checked={selectedServices.services.facial}
                      onChange={(e) => handleServiceSelect('facial', e.target.checked)}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label htmlFor="facial" className="ml-2 block text-sm text-gray-700">
                      Facial Treatment
                    </label>
                  </div>
                </div>
              </div>

              {/* Nail Care */}
              <div className="pl-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="nailCare"
                    checked={selectedServices.categories.nailCare}
                    onChange={(e) => handleCategorySelect('nailCare', e.target.checked)}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="nailCare" className="ml-2 block text-sm font-medium text-gray-700">
                    Nail Care
                  </label>
                </div>
                <div className="pl-6 mt-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="manicure"
                      checked={selectedServices.services.manicure}
                      onChange={(e) => handleServiceSelect('manicure', e.target.checked)}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label htmlFor="manicure" className="ml-2 block text-sm text-gray-700">
                      Manicure
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-10 mb-4" data-aos="fade-left">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-pink-500 text-white px-8 py-3 rounded-full shadow-lg hover:bg-pink-600 transition-colors text-lg font-semibold"
        >
          <Save size={22} />
          Save Changes
        </button>
      </div>

      {/* Preview Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Preview</h2>
        <div className="bg-customPink p-10 px-5 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Tag size={24} className="text-pink-600" />
              <h3 className="text-xl font-semibold">{discountPercentage}% Off</h3>
            </div>
            <p className="text-gray-600">Valid until: {validUntil}</p>
          </div>
          <div className="mt-4">
            <p className="text-gray-700 font-medium mb-2">Applied to:</p>
            <ul className="space-y-2">
              {selectedServices.categories.hairCare && (
                <li className="text-gray-600">• Hair Care Services</li>
              )}
              {selectedServices.categories.skinCare && (
                <li className="text-gray-600">• Skin Care Services</li>
              )}
              {selectedServices.categories.nailCare && (
                <li className="text-gray-600">• Nail Care Services</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discounts; 