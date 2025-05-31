import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Login.module.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('/api/user/forgot-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Forgot Password</h2>
        {message && <div className={styles.success}>{message}</div>}
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <button 
            type="submit" 
            className={styles.button}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Password'}
          </button>
        </form>

        <div className={styles.links}>
          <Link to="/login" className={styles.link}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 