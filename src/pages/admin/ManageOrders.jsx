import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Package, Tag, Star, X } from 'lucide-react';

const ManageOrders = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchCategories();
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/categories', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setCategories(response.data);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const response = await axios.post('/api/categories', 
        { name: newCategory.trim() },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setCategories([...categories, response.data]);
      setNewCategory('');
      setShowAddCategory(false);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category and all its services?')) return;

    try {
      await axios.delete(`/api/categories/${categoryId}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setCategories(categories.filter(cat => cat._id !== categoryId));
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete category');
    }
  };

  const handleAddService = async (categoryId, serviceData) => {
    try {
      const { name, price, description } = serviceData;
      const validatedPrice = typeof price === 'number' && !isNaN(price) ? price : 0;
      const response = await axios.post(
        `/api/categories/${categoryId}/services`,
        { name, price: validatedPrice, description },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setCategories(categories.map(cat => 
        cat._id === categoryId 
          ? { ...cat, services: [...cat.services, response.data] }
          : cat
      ));
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add service');
    }
  };

  const handleDeleteService = async (categoryId, serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    try {
      await axios.delete(
        `/api/categories/${categoryId}/services/${serviceId}`,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setCategories(categories.map(cat => 
        cat._id === categoryId 
          ? { ...cat, services: cat.services.filter(service => service._id !== serviceId) }
          : cat
      ));
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete service');
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
        <h1 className="text-3xl font-bold text-gray-800">Manage Orders</h1>
        <button
          onClick={() => setShowAddCategory(true)}
          className="flex items-center gap-2 bg-pink-100 text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-200 transition-colors"
        >
          <PlusCircle size={20} />
          <span>Add Category</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add New Category</h2>
              <button
                onClick={() => setShowAddCategory(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddCategory}>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category Name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 mb-4 bg-white text-gray-800"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <div key={category._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">{category.name}</h2>
              <button
                onClick={() => handleDeleteCategory(category._id)}
                className="text-red-600 hover:text-red-800"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              {category.services.map(service => (
                <div key={service._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-800">{service.name}</h3>
                    <button
                      onClick={() => handleDeleteService(category._id, service._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  {service.description && (
                    <p className="text-sm text-gray-500 mb-2">{service.description}</p>
                  )}
                  <p className="text-sm text-gray-600">Price: ₹{service.price}</p>
                </div>
              ))}
              <button
                onClick={() => setSelectedCategory(category)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors"
              >
                <PlusCircle size={20} />
                <span>Add Service</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[1000]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Service to {selectedCategory.name}</h2>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const price = formData.get('price');
              
              if (!price || isNaN(Number(price))) {
                setError('Please enter a valid price');
                return;
              }

              handleAddService(selectedCategory._id, {
                name: formData.get('name'),
                price: Number(price),
                description: formData.get('description') || ''
              });
              setSelectedCategory(null);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-800"
                    placeholder="Enter a short description for this service"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-800"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders; 