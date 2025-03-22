import { useNavigate, Link, NavLink, useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  Home,
  ShoppingBasket,
  Users,
  Info,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";
import { ChevronDown, User } from "lucide-react";
import useAuth from "../hooks/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Use our Redux-based auth hook instead of localStorage
  const { isLoggedIn, user, logout } = useAuth();

  const navItems = [
    { name: "Home", path: "/", icon: <Home size={18} /> },
    { name: "Marketplace", path: "/marketplace", icon: <Info size={18} /> },
    { name: "Trusted Farmers", path: "/farmers", icon: <Info size={18} /> },
    { name: "About", path: "/about", icon: <Info size={18} /> },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Hide navbar on login and register pages when user is authenticated
  if (
    isLoggedIn &&
    (location.pathname === "/login" || location.pathname === "/register")
  ) {
    return null;
  }

  return (
    <header className="bg-black py-4 px-6 sm:px-10 flex justify-between items-center fixed w-full z-50 border-b border-teal-500/30 shadow-lg">
      <div className="text-white text-2xl font-bold flex items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-xl">K</span>
          </div>
          <span className="text-teal-400 font-bold">Krushi</span>
          <span className="text-white">Setu</span>
        </Link>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="text-white p-2 rounded-full hover:bg-teal-500/20 transition-all"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `relative flex items-center space-x-1 px-1 py-2 overflow-hidden group ${
                isActive ? "text-teal-400" : "text-gray-300 hover:text-teal-400"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`${
                    isActive
                      ? "text-teal-400"
                      : "text-gray-400 group-hover:text-teal-400"
                  } transition-colors duration-300`}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300 ease-in-out transform ${
                    isActive
                      ? "bg-teal-400 scale-x-100"
                      : "bg-teal-500 scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      {isLoggedIn ? (
        <div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-300 hover:text-white">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-teal-400" />
                </div>
                <span className="text-sm mr-1">
                  {user?.name || user?.email?.split('@')[0] || 'User'}
                </span>
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>

              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md shadow-lg py-1 bg-[#1a332e] ring-1 ring-black ring-opacity-5 opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible transition-all">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-teal-500/20"
                >
                  Profile
                </Link>
                <Link
                  to="/account"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-teal-500/20"
                >
                  Account
                </Link>
                <hr className="my-1 border-gray-700" />
                <button
                  onClick={() => {
                    logout(); // Use our logout function from useAuth
                    navigate("/");
                  }}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-teal-500/20"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex items-center space-x-4">
          <button
            className="text-white border border-teal-500 px-4 py-2 rounded-md hover:bg-teal-500/20 hover:border-teal-400 transition-all duration-300 flex items-center space-x-2"
            onClick={() => navigate("/login")}
          >
            <LogIn size={16} />
            <span>Sign In</span>
          </button>

          <button
            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-500 transition-all duration-300 flex items-center space-x-2"
            onClick={() => navigate("/register")}
          >
            <UserPlus size={16} />
            <span>Register</span>
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;