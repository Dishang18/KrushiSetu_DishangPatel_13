import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingBag, User, Heart, ShoppingCart, Clock } from 'lucide-react';

function ConsumerNavLinks() {
  const navLinkClass = ({ isActive }) => 
    `flex items-center px-4 py-2.5 rounded-lg transition-colors ${
      isActive 
        ? 'bg-teal-500/20 text-white' 
        : 'text-gray-400 hover:text-white hover:bg-teal-500/10'
    }`;
    
  return (
    <>
      <NavLink to="/consumer/dashboard" className={navLinkClass}>
        <Home className="w-5 h-5 mr-3" />
        Dashboard
      </NavLink>
      
      <NavLink to="/consumer/profile" className={navLinkClass}>
        <User className="w-5 h-5 mr-3" />
        Profile
      </NavLink>
      
      <NavLink to="/consumer/shop" className={navLinkClass}>
        <ShoppingBag className="w-5 h-5 mr-3" />
        Shop
      </NavLink>
      
      <NavLink to="/consumer/orders" className={navLinkClass}>
        <ShoppingCart className="w-5 h-5 mr-3" />
        Orders
      </NavLink>
      
      <NavLink to="/consumer/wishlist" className={navLinkClass}>
        <Heart className="w-5 h-5 mr-3" />
        Wishlist
      </NavLink>
      
      <NavLink to="/consumer/history" className={navLinkClass}>
        <Clock className="w-5 h-5 mr-3" />
        Order History
      </NavLink>
    </>
  );
}

export default ConsumerNavLinks; 