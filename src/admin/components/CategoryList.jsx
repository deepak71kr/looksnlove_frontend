import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import ServiceForm from './ServiceForm';

const cardStyle = {
  border: '1px solid #e0e0e0',
  borderRadius: 8,
  margin: '1.5em 0',
  padding: '1.5em',
  background: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.2s'
};

const buttonStyle = {
  marginLeft: 10,
  padding: '0.35em 1em',
  borderRadius: 4,
  border: 'none',
  cursor: 'pointer',
  background: '#1976d2',
  color: '#fff',
  fontWeight: 500,
  transition: 'background 0.2s'
};

const deleteButtonStyle = {
  ...buttonStyle,
  background: '#e53935'
};

const CategoryList = ({ refresh }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState('');
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      setError('Failed to load categories. Please try again.');
      console.error('Error fetching categories:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, [refresh]);

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category and all its services?')) return;
    
    setDeleting(id);
    setError('');
    try {
      const response = await api.delete(`/categories/${id}`);
      if (response.data) {
        await fetchCategories();
      }
    } catch (err) {
      setError('Failed to delete category. Please try again.');
      console.error('Error deleting category:', err);
    } finally {
      setDeleting('');
    }
  };

  const handleDeleteService = async (categoryId, serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    
    setDeleting(serviceId);
    setError('');
    try {
      const response = await api.delete(`/categories/${categoryId}/services/${serviceId}`);
      if (response.data) {
        await fetchCategories();
      }
    } catch (err) {
      setError('Failed to delete service. Please try again.');
      console.error('Error deleting service:', err);
    } finally {
      setDeleting('');
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2em 1em' }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: '1.5em' }}>Categories</h2>
      {error && <div style={{ color: 'red', marginBottom: 16, textAlign: 'center' }}>{error}</div>}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#888' }}>Loading categories...</div>
      ) : categories.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888' }}>No categories found.</div>
      ) : (
        categories.map(cat => (
          <div
            key={cat._id}
            style={{
              ...cardStyle,
              boxShadow: selectedCategory && selectedCategory._id === cat._id
                ? '0 4px 16px rgba(25, 118, 210, 0.08)'
                : cardStyle.boxShadow
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0 }}>{cat.name}</h3>
              <div>
                <button
                  onClick={() => setSelectedCategory(cat)}
                  style={buttonStyle}
                  aria-label={`Add service to ${cat.name}`}
                  title="Add Service"
                >
                  + Add Service
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat._id)}
                  style={deleteButtonStyle}
                  disabled={deleting === cat._id}
                  aria-label={`Delete category ${cat.name}`}
                  title="Delete Category"
                >
                  {deleting === cat._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
            <ul style={{ marginTop: 16, marginBottom: 0, paddingLeft: 20 }}>
              {cat.services.length === 0 ? (
                <li style={{ color: '#888', fontStyle: 'italic' }}>No services in this category.</li>
              ) : cat.services.map(service => (
                <li key={service._id} style={{ marginBottom: 8 }}>
                  <b>{service.name}</b>
                  {' | '}
                  {Object.entries(service.prices).map(([key, value]) =>
                    value ? (
                      <span key={key} style={{ marginRight: 8, color: '#1976d2' }}>
                        {key}: ₹{value}
                      </span>
                    ) : null
                  )}
                  <button
                    onClick={() => handleDeleteService(cat._id, service._id)}
                    style={deleteButtonStyle}
                    disabled={deleting === service._id}
                    aria-label={`Delete service ${service.name}`}
                    title="Delete Service"
                  >
                    {deleting === service._id ? 'Deleting...' : 'Delete'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
      {selectedCategory && (
        <ServiceForm
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
          onServiceAdded={fetchCategories}
        />
      )}
    </div>
  );
};

export default CategoryList;
