import React, { useState } from 'react';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X,
  ChevronDown,
  Leaf
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const currentUser = "Dishang18";
  
  return (
    <nav className="bg-green-700 text-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and website name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Leaf className="h-8 w-8 text-green-200" />
              <span className="ml-2 text-xl font-bold">KrushiSetu</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Bar */}
           

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/consumer/dashboard" className="hover:text-green-200 transition">Dashboard</Link>
              <Link to="/consumer/products" className="hover:text-green-200 transition">Products</Link>
              <Link to="/services" className="hover:text-green-200 transition">Services</Link>
              <Link to="/about" className="hover:text-green-200 transition">About</Link>
            </div>

            {/* Cart */}
            <div className="relative">
              <Link to="/cart" className="hover:text-green-200 transition">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">3</span>
              </Link>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center hover:text-green-200 transition focus:outline-none"
              >
                <User className="h-6 w-6" />
                <span className="ml-1">{currentUser}</span>
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Content */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800">
                  <Link to="/consumer/profile" className="block px-4 py-2 hover:bg-gray-100">My Profile</Link>
                  <Link to="/consumer/orders" className="block px-4 py-2 hover:bg-gray-100">My Orders</Link>
                  <Link to="/consumer/wishlist" className="block px-4 py-2 hover:bg-gray-100">Wishlist</Link>
                  <Link to="/consumer/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                  <div className="border-t border-gray-200"></div>
                  <Link to="/logout" className="block px-4 py-2 hover:bg-gray-100">Logout</Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-green-200 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/consumer/dashboard" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600">Dashboard</Link>
            <Link to="/consumer/products" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600">Products</Link>
            <Link to="/services" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600">Services</Link>
            <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600">About</Link>
          </div>
          
          <div className="pt-4 pb-3 border-t border-green-600">
            <div className="px-2 space-y-1">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <User className="h-10 w-10" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium">{currentUser}</div>
                </div>
              </div>
              
              <Link to="/consumer/profile" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600">My Profile</Link>
              <Link to="/consumer/orders" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600">My Orders</Link>
              <Link to="/cart" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600">
                Cart <span className="ml-1 bg-yellow-500 text-xs rounded-full px-2 py-1">3</span>
              </Link>
              <Link to="/consumer/settings" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600">Settings</Link>
              <Link to="/logout" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600">Logout</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;