import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, FileCheck, ShoppingCart, Settings, Package } from 'lucide-react';

function AdminNavLinks() {
  const navLinkClass = ({ isActive }) => 
    `flex items-center px-4 py-2.5 rounded-lg transition-colors ${
      isActive 
        ? 'bg-teal-500/20 text-white' 
        : 'text-gray-400 hover:text-white hover:bg-teal-500/10'
    }`;
    
  return (
    <>
      <NavLink to="/admin/dashboard" className={navLinkClass}>
        <Home className="w-5 h-5 mr-3" />
        Dashboard
      </NavLink>
      
      <NavLink to="/admin/users" className={navLinkClass}>
        <Users className="w-5 h-5 mr-3" />
        Users
      </NavLink>
      
      <NavLink to="/admin/verify-documents" className={navLinkClass}>
        <FileCheck className="w-5 h-5 mr-3" />
        Verify Documents
      </NavLink>
      
      <NavLink to="/admin/products" className={navLinkClass}>
        <Package className="w-5 h-5 mr-3" />
        Products
      </NavLink>
      
      <NavLink to="/admin/orders" className={navLinkClass}>
        <ShoppingCart className="w-5 h-5 mr-3" />
        Orders
      </NavLink>
      
      <NavLink to="/admin/settings" className={navLinkClass}>
        <Settings className="w-5 h-5 mr-3" />
        Settings
      </NavLink>
    </>
  );
}

export default AdminNavLinks;
