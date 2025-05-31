import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const success = await signup(formData);
      if (success) {
        navigate("/");
      } else {
        setError("Failed to create account");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-pink-50 to-pink-100">
      <div className="w-full max-w-md bg-white bg-opacity-90 rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-bold text-center text-pink-600 mb-2">LooksNLove</h1>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500 text-center">{error}</div>}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white text-gray-800 placeholder-gray-600 ${styles.inputWhite}`}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white text-gray-800 placeholder-gray-600 ${styles.inputWhite}`}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white text-gray-800 placeholder-gray-600 ${styles.inputWhite}`}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-transparent bg-white text-gray-800 placeholder-gray-600 ${styles.inputWhite}`}
            required
          />
          <button
            type="submit"
            className="w-full bg-pink-600 text-white p-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-pink-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
