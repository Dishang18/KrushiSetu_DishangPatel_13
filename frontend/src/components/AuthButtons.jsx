import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AuthButtons = () => {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <div className="flex items-center gap-4">
      {isLoggedIn ? (
        <>
          <div className="text-white">
            Welcome, {user?.name || user?.email?.split('@')[0]}
          </div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-[#1a332e] hover:bg-opacity-90 text-white py-2 px-4 rounded-lg border border-teal-500/30 transition-colors"
          >
            Register
          </Link>
        </>
      )}
    </div>
  );
};

export default AuthButtons; 