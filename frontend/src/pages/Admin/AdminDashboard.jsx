import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import useAuth from "../../hooks/useAuth";
import { getTokenFromCookie } from "../../utils/cookies";
import {
  Users,
  Package,
  ShoppingCart,
  Settings,
  FileCheck,
  Clock,
  ChevronRight,
  BarChart2,
  TrendingUp,
  ShieldCheck,
  Bell,
  Search,
  Zap,
  FileText,
} from "lucide-react";
import axiosInstance from "../../context/axiosInstance";

function AdminDashboard() {
  const token = getTokenFromCookie();
  console.log(token)
  const { user } = useAuth();

  // Add console.log to debug user state
  useEffect(() => {
    console.log('Current user state:', user);
  }, [user]);

  const [stats, setStats] = useState({
    pendingDocuments: 0,
    totalFarmers: 0,
    totalProducts: 0,
    activeOrders: 0,
    certificatesIssued: 0,
    totalRevenue: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");

  const fetchDashboardStats = async () => {
    const token = getTokenFromCookie();
    setIsLoading(true);
    setError(null);
    
    try {
      // Debug log for token
      console.log('Token available:', !!token);
      console.log('User role:', user?.role);

      if (!token) {
        setError('Authentication required');
        return;
      }

      // Make sure to use the correct authorization header format
      const response = await axiosInstance.get('/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Debug log for response
      console.log('API Response:', response.data);
      
      if (response.data) {
        setStats(prevStats => ({
          ...prevStats,
          pendingDocuments: response.data.pendingDocuments ?? 0,
          totalFarmers: response.data.totalFarmers ?? 0,
          totalProducts: response.data.totalProducts ?? 0,
          activeOrders: response.data.activeOrders ?? 0,
          certificatesIssued: response.data.certificatesIssued ?? 0,
          totalRevenue: response.data.totalRevenue ?? 0,
        }));
      }
    } catch (error) {
      console.error('Detailed error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        token: !!user?.token
      });
      
      let errorMessage = 'Failed to fetch dashboard statistics';
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Your session has expired. Please log in again.';
            break;
          case 403:
            errorMessage = 'You are not authorized to view this data. Admin access required.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later';
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        errorMessage = 'Unable to reach the server. Please check your connection.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Update the useEffect to include better checks
  useEffect(() => {
    if (user && token) {
      console.log('Initiating fetch with token');
      fetchDashboardStats();
    } else {
      console.log('No user or token available');
      setError('Please log in to view dashboard statistics');
      setIsLoading(false);
    }
  }, [user]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f1a] via-[#0a2018] to-[#0c2a22]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Admin Header with Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome, Admin
            </h1>
            <p className="text-emerald-300 flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative flex items-center"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="bg-[#193d33] text-white pl-10 pr-4 py-2 rounded-lg border border-[#2b5e4f] focus:outline-none focus:ring-2 focus:ring-emerald-500/60 w-full lg:w-64"
              />
              <Search className="w-4 h-4 text-emerald-300 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <button className="ml-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white p-2 rounded-lg flex items-center justify-center transition-colors shadow-md shadow-emerald-800/30">
              <Zap className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            // Show loading skeletons
            Array(6).fill(null).map((_, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-[#1d4b3e] to-[#0f2a24] p-6 rounded-xl border border-emerald-500/30 shadow-lg shadow-emerald-900/30"
              >
                <div className="animate-pulse">
                  <div className="h-4 bg-emerald-500/20 rounded w-1/3 mb-2"></div>
                  <div className="h-8 bg-emerald-500/20 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : error ? (
            // Show error message
            <div className="col-span-full">
              <div className="bg-red-500/20 text-red-300 p-4 rounded-xl border border-red-500/30">
                {error}
              </div>
            </div>
          ) : (
            // Show actual stats
            <>
              {/* Pending Documents Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-[#1d4b3e] to-[#0f2a24] p-6 rounded-xl border border-emerald-500/30 shadow-lg shadow-emerald-900/30"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-emerald-300 text-sm font-medium">Pending Documents</p>
                    <h3 className="text-2xl font-bold text-white mt-2">{stats.pendingDocuments}</h3>
                  </div>
                  <div className="p-2 bg-orange-500/30 rounded-lg">
                    <FileText className="w-6 h-6 text-orange-300" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-emerald-100/80 text-xs">Requires verification</p>
                  <Link
                    to="/admin/verify-documents"
                    className="text-xs flex items-center text-amber-300 hover:text-amber-200 transition-colors"
                  >
                    Verify <ChevronRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </motion.div>

              {/* Total Farmers Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[#1d4b3e] to-[#0f2a24] p-6 rounded-xl border border-emerald-500/30 shadow-lg shadow-emerald-900/30"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-emerald-300 text-sm font-medium">Total Farmers</p>
                    <h3 className="text-2xl font-bold text-white mt-2">{stats.totalFarmers}</h3>
                  </div>
                  <div className="p-2 bg-emerald-500/30 rounded-lg">
                    <Users className="w-6 h-6 text-emerald-300" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-emerald-100/80 text-xs">12 new this month</p>
                  <Link
                    to="/admin/users"
                    className="text-xs flex items-center text-amber-300 hover:text-amber-200 transition-colors"
                  >
                    View all <ChevronRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </motion.div>

              {/* Total Products Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-[#1d4b3e] to-[#0f2a24] p-6 rounded-xl border border-emerald-500/30 shadow-lg shadow-emerald-900/30"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-emerald-300 text-sm font-medium">Total Products</p>
                    <h3 className="text-2xl font-bold text-white mt-2">{stats.totalProducts}</h3>
                  </div>
                  <div className="p-2 bg-purple-500/30 rounded-lg">
                    <Package className="w-6 h-6 text-purple-300" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-emerald-100/80 text-xs">36 new this month</p>
                  <Link
                    to="/admin/products"
                    className="text-xs flex items-center text-amber-300 hover:text-amber-200 transition-colors"
                  >
                    View all <ChevronRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </motion.div>

              {/* Active Orders Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-[#1d4b3e] to-[#0f2a24] p-6 rounded-xl border border-emerald-500/30 shadow-lg shadow-emerald-900/30"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-emerald-300 text-sm font-medium">Active Orders</p>
                    <h3 className="text-2xl font-bold text-white mt-2">{stats.activeOrders}</h3>
                  </div>
                  <div className="p-2 bg-blue-500/30 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-blue-300" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-emerald-100/80 text-xs">8 need attention</p>
                  <Link
                    to="/admin/orders"
                    className="text-xs flex items-center text-amber-300 hover:text-amber-200 transition-colors"
                  >
                    View all <ChevronRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </motion.div>

              {/* Certificates Issued Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-[#1d4b3e] to-[#0f2a24] p-6 rounded-xl border border-emerald-500/30 shadow-lg shadow-emerald-900/30"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-emerald-300 text-sm font-medium">Certificates Issued</p>
                    <h3 className="text-2xl font-bold text-white mt-2">{stats.certificatesIssued}</h3>
                  </div>
                  <div className="p-2 bg-yellow-500/30 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-yellow-300" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-emerald-100/80 text-xs">All valid and active</p>
                  <Link
                    to="/admin/certificates"
                    className="text-xs flex items-center text-amber-300 hover:text-amber-200 transition-colors"
                  >
                    View all <ChevronRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </motion.div>

              {/* Total Revenue Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-[#1d4b3e] to-[#0f2a24] p-6 rounded-xl border border-emerald-500/30 shadow-lg shadow-emerald-900/30"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-emerald-300 text-sm font-medium">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-white mt-2">{formatCurrency(stats.totalRevenue)}</h3>
                  </div>
                  <div className="p-2 bg-green-500/30 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-300" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-emerald-100/80 text-xs">+18% from last month</p>
                  <Link
                    to="/admin/finance"
                    className="text-xs flex items-center text-amber-300 hover:text-amber-200 transition-colors"
                  >
                    View report <ChevronRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <h2 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/admin/verify-documents">
              <div className="bg-gradient-to-br from-[#1d4b3e] to-[#0f2a24] hover:from-[#235045] hover:to-[#17352d] p-6 rounded-xl flex flex-col items-center justify-center text-center transition-all border border-emerald-500/30 h-full shadow-lg shadow-emerald-900/30 hover:shadow-emerald-700/20 hover:translate-y-[-2px]">
                <div className="w-12 h-12 bg-teal-500/30 rounded-full flex items-center justify-center mb-3">
                  <FileCheck className="w-6 h-6 text-teal-300" />
                </div>
                <h3 className="text-white font-medium mb-1">
                  Verify Documents
                </h3>
                <p className="text-emerald-100/80 text-xs">Review farmer documents</p>
              </div>
            </Link>
            <Link to="/admin/users">
              <div className="bg-gradient-to-br from-[#1d4b3e] to-[#0f2a24] hover:from-[#235045] hover:to-[#17352d] p-6 rounded-xl flex flex-col items-center justify-center text-center transition-all border border-emerald-500/30 h-full shadow-lg shadow-emerald-900/30 hover:shadow-emerald-700/20 hover:translate-y-[-2px]">
                <div className="w-12 h-12 bg-sky-500/30 rounded-full flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-sky-300" />
                </div>
                <h3 className="text-white font-medium mb-1">Users</h3>
                <p className="text-emerald-100/80 text-xs">Manage user accounts</p>
              </div>
            </Link>
            <Link to="/admin/products">
              <div className="bg-gradient-to-br from-[#1d4b3e] to-[#0f2a24] hover:from-[#235045] hover:to-[#17352d] p-6 rounded-xl flex flex-col items-center justify-center text-center transition-all border border-emerald-500/30 h-full shadow-lg shadow-emerald-900/30 hover:shadow-emerald-700/20 hover:translate-y-[-2px]">
                <div className="w-12 h-12 bg-emerald-500/30 rounded-full flex items-center justify-center mb-3">
                  <Package className="w-6 h-6 text-emerald-300" />
                </div>
                <h3 className="text-white font-medium mb-1">Products</h3>
                <p className="text-emerald-100/80 text-xs">
                  Manage marketplace products
                </p>
              </div>
            </Link>
            <Link to="/admin/settings">
              <div className="bg-gradient-to-br from-[#1d4b3e] to-[#0f2a24] hover:from-[#235045] hover:to-[#17352d] p-6 rounded-xl flex flex-col items-center justify-center text-center transition-all border border-emerald-500/30 h-full shadow-lg shadow-emerald-900/30 hover:shadow-emerald-700/20 hover:translate-y-[-2px]">
                <div className="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center mb-3">
                  <Settings className="w-6 h-6 text-purple-300" />
                </div>
                <h3 className="text-white font-medium mb-1">Settings</h3>
                <p className="text-emerald-100/80 text-xs">Configure the platform</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDashboard;