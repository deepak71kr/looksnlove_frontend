import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import AdminDashboard from './pages/AdminDashboard';
import AdminMessages from './pages/AdminMessages';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Services from './pages/Services';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import Ratings from './pages/admin/Ratings';
import Discounts from './pages/admin/Discounts';
import CheckoutSuccess from './pages/CheckoutSuccess';
import ManageOrders from './pages/admin/ManageOrders';
import Appointments from './pages/admin/Appointments';

// Protected route for cart and checkout
const ProtectedCartRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Protected route for admin pages
const ProtectedAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Cart Routes */}
      <Route path="/cart" element={
        <ProtectedCartRoute>
          <Cart />
        </ProtectedCartRoute>
      } />
      <Route path="/checkout" element={
        <ProtectedCartRoute>
          <Checkout />
        </ProtectedCartRoute>
      } />
      <Route path="/checkout-success" element={
        <ProtectedCartRoute>
          <CheckoutSuccess />
        </ProtectedCartRoute>
      } />
      <Route path="/profile" element={
        <ProtectedCartRoute>
          <Profile />
        </ProtectedCartRoute>
      } />
      <Route path="/order-history" element={
        <ProtectedCartRoute>
          <OrderHistory />
        </ProtectedCartRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedAdminRoute>
          <AdminDashboard />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/messages" element={
        <ProtectedAdminRoute>
          <AdminMessages />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/ratings" element={
        <ProtectedAdminRoute>
          <Ratings />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/discounts" element={
        <ProtectedAdminRoute>
          <Discounts />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/orders" element={
        <ProtectedAdminRoute>
          <ManageOrders />
        </ProtectedAdminRoute>
      } />
      <Route path="/admin/appointments" element={
        <ProtectedAdminRoute>
          <Appointments />
        </ProtectedAdminRoute>
      } />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes; 