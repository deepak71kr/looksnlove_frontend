import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Login from '../auth/Login';
import Signup from '../auth/Signup';
import Profile from '../pages/Profile';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Services from '../pages/Services';
import ProtectedRoute from '../components/ProtectedRoute';
import ForgotPassword from '../auth/ForgotPassword';
import ResetPassword from '../auth/ResetPassword';
<<<<<<< HEAD
import Orders from '../components/Orders';
import AdminDashboard from '../pages/AdminDashboard';
=======
import OrderHistory from '../pages/OrderHistory';
import AdminDashboard from '../admin/AdminDashboard';
>>>>>>> e8a006f182eff1498daae3fdff89e9110b112031
import AdminRoute from '../components/AdminRoute';
import Ratings from '../pages/admin/Ratings';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about-us" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/services" element={<Services />} />
      
      {/* Protected Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/ratings"
        element={
          <AdminRoute>
            <Ratings />
          </AdminRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes; 