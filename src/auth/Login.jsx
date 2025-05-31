import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css"; // For white placeholder
import { useAuth } from "../context/AuthContext";

const ForgotPasswordModal = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post("/api/auth/forgot-password", { email }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (res.data.success) {
        setMessage("Password reset instructions sent to your email!");
      } else {
        setMessage(res.data.message || "Email not registered.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      if (error.response) {
        setMessage(error.response.data.message || "Error sending reset instructions. Please try again.");
      } else if (error.request) {
        setMessage("No response from server. Please check your connection.");
      } else {
        setMessage("Error sending reset instructions. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 space-y-4 shadow-lg">
        <h3 className="text-2xl font-semibold text-pink-600 text-center">Forgot Password?</h3>
        <form onSubmit={handleForgot} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-3 border border-gray-300 rounded-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition ${styles.inputWhite}`}
            required
          />
          <button
            type="submit"
            className="w-full bg-pink-600 text-white p-3 rounded-lg font-semibold hover:bg-pink-700"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {message && <p className="text-center text-sm">{message}</p>}
        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="text-pink-600 font-semibold hover:underline"
          >
            Back to Sign In
          </button>
          <Link
            to="/signup"
            className="text-pink-600 font-semibold hover:underline"
            onClick={onClose}
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        setError('Invalid email or password');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Failed to log in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-pink-50 to-pink-100">
      <div className="w-full max-w-md bg-white bg-opacity-90 rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center text-pink-600 mb-2">LooksNLove</h1>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white text-gray-800 placeholder-gray-600 ${styles.inputWhite}`}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white text-gray-800 placeholder-gray-600 ${styles.inputWhite}`}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white p-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setShowForgot(true)}
            className="text-pink-600 hover:underline text-sm"
          >
            Forgot Password?
          </button>
          <Link to="/signup" className="text-pink-600 hover:underline text-sm">
            Create Account
          </Link>
        </div>
      </div>
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
    </div>
  );
};

export default Login;
