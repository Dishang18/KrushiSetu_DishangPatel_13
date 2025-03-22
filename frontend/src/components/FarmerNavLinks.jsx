import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, FileText, ShoppingCart, BarChart2, FileCheck, User } from 'lucide-react';

function FarmerNavLinks() {
  const navLinkClass = ({ isActive }) => 
    `flex items-center px-4 py-2.5 rounded-lg transition-colors ${
      isActive 
        ? 'bg-teal-500/20 text-white' 
        : 'text-gray-400 hover:text-white hover:bg-teal-500/10'
    }`;
    
  return (
    <>
      <NavLink to="/farmer/dashboard" className={navLinkClass}>
        <Home className="w-5 h-5 mr-3" />
        Dashboard
      </NavLink>
      
      <NavLink to="/farmer/profile" className={navLinkClass}>
        <User className="w-5 h-5 mr-3" />
        Profile
      </NavLink>
      
      <NavLink to="/farmer/products" className={navLinkClass}>
        <Package className="w-5 h-5 mr-3" />
        Products
      </NavLink>
      
      <NavLink to="/farmer/orders" className={navLinkClass}>
        <ShoppingCart className="w-5 h-5 mr-3" />
        Orders
      </NavLink>
      
      <NavLink to="/farmer/documents" className={navLinkClass}>
        <FileText className="w-5 h-5 mr-3" />
        Documents
      </NavLink>
      
      <NavLink to="/farmer/certificate" className={navLinkClass}>
        <FileCheck className="w-5 h-5 mr-3" />
        Certificate
      </NavLink>
      
      <NavLink to="/farmer/analytics" className={navLinkClass}>
        <BarChart2 className="w-5 h-5 mr-3" />
        Analytics
      </NavLink>
    </>
  );
}

export default FarmerNavLinks;
