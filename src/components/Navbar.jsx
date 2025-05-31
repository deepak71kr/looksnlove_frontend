import React, { useState, useEffect } from "react";
import {
  ShoppingCartIcon,
  UserIcon,
  MenuIcon,
  LogOutIcon,
  UserCircleIcon,
  ShoppingCart,
  Menu,
  X,
  User,
  Settings,
  Package,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const { cartItems = [], cartTotal = 0, loading } = useCart();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Close mobile menu when authentication state changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/logo.jpeg"
              alt="Salon Logo"
              className="h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 font-semibold">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Services
            </Link>
            <Link
              to="/about-us"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              About Us
            </Link>
            <a
              href="#foot"
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Contact
            </a>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="text-pink-600 hover:text-pink-700 transition-colors font-semibold"
              >
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Cart Dropdown */}
                <div className="relative group z-50">
                  <Link to="/cart" className="p-2 hover:bg-pink-100 rounded-full transition-colors relative inline-flex items-center">
                    <ShoppingCart size={20} />
                    {!loading && cartItems && cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </Link>
                  <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="p-4">
                      {loading ? (
                        <div className="text-sm text-gray-500">Loading cart...</div>
                      ) : cartItems && cartItems.length > 0 ? (
                        <>
                          <div className="text-sm font-medium text-gray-900">
                            {cartItems.length} Items
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Subtotal: {formatPrice(cartTotal)}
                          </div>
                          <Link to="/cart">
                            <button className="mt-3 w-full bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors">
                              View Cart
                            </button>
                          </Link>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">Your cart is empty</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* User Dropdown */}
                <div className="relative group z-40">
                  <button className="p-2 hover:bg-pink-100 rounded-full transition-colors">
                    <UserIcon size={20} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-40">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <UserCircleIcon size={16} className="mr-2" /> Profile
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Settings size={16} className="mr-2" /> Admin Panel
                        </Link>
                      )}
                      <Link
                        to="/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Package size={16} className="mr-2" />
                        Order History
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOutIcon size={16} className="mr-2" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={handleLoginClick}
                className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
              >
                Login
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-pink-100 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 font-semibold">
              <Link
                to="/"
                className="text-gray-700 hover:text-gray-900 transition-colors px-4"
              >
                Home
              </Link>
              <Link
                to="/services"
                className="text-gray-700 hover:text-gray-900 transition-colors px-4"
              >
                Services
              </Link>
              <Link
                to="/about-us"
                className="text-gray-700 hover:text-gray-900 transition-colors px-4"
              >
                About Us
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-pink-600 hover:text-pink-700 transition-colors px-4 font-semibold"
                >
                  Admin Dashboard
                </Link>
              )}
              {!isAuthenticated && (
                <button
                  onClick={handleLoginClick}
                  className="text-gray-700 hover:text-gray-900 transition-colors px-4 text-left"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
