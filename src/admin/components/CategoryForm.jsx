import React, { useState } from 'react';
import api from '../../api/api';

const CategoryForm = ({ onCategoryAdded }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/categories', { name: name.trim() });
      setName('');
      setSuccess('Category added!');
      if (onCategoryAdded) onCategoryAdded();
    } catch (err) {
      setError('Failed to add category. Try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(''), 2000); // Clear success after 2s
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginBottom: '2em',
        padding: '1em',
        border: '1px solid #ddd',
        borderRadius: 8,
        maxWidth: 400,
        background: '#fafafa'
      }}
      aria-label="Add Category Form"
    >
      <label htmlFor="category-name" style={{ marginRight: 8 }}>
        New Category Name:
      </label>
      <input
        id="category-name"
        type="text"
        placeholder="e.g. Groceries"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        disabled={loading}
        style={{
          padding: '0.5em',
          borderRadius: 4,
          border: '1px solid #ccc',
          marginRight: 8
        }}
        autoFocus
      />
      <button
        type="submit"
        disabled={loading || !name.trim()}
        style={{
          padding: '0.5em 1em',
          borderRadius: 4,
          border: 'none',
          background: '#1976d2',
          color: '#fff',
          cursor: loading || !name.trim() ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Adding...' : 'Add Category'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
    </form>
  );
};

export default CategoryForm;
