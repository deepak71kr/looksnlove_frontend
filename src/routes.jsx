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

const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/services" element={<Services />} />
      
      {/* Protected User Routes */}
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
        path="/checkout/success" 
        element={
          <ProtectedRoute>
            <CheckoutSuccess />
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
          <ProtectedRoute requireAdmin>
            <Navigate to="/admin-dashboard" replace />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-dashboard" 
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-dashboard/ratings" 
        element={
          <ProtectedRoute requireAdmin>
            <Ratings />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-dashboard/discounts" 
        element={
          <ProtectedRoute requireAdmin>
            <Discounts />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/messages" 
        element={
          <ProtectedRoute requireAdmin>
            <AdminMessages />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-dashboard/orders" 
        element={
          <ProtectedRoute requireAdmin>
            <ManageOrders />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-dashboard/appointments" 
        element={
          <ProtectedRoute requireAdmin>
            <Appointments />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes; 