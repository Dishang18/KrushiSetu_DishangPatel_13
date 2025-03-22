import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../contexts/AuthContext";
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
} from "lucide-react";
import axiosInstance from "../../context/axiosInstance";

function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    pendingDocuments: 0,
    totalFarmers: 24,
    totalProducts: 156,
    activeOrders: 38,
    certificatesIssued: 19,
    totalRevenue: 328450,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      if (!user || user.role !== "admin") return;

      try {
        setIsLoading(true);
        // Fetch pending documents count
        const docsResponse = await axiosInstance.get("/documents/pending/all");

        setStats((prev) => ({
          ...prev,
          pendingDocuments: docsResponse.data.length,
        }));

        // Add more stat fetching as needed
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        // Simulate loading for demo purposes
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    fetchStats();
  }, [user]);

  // Recent activity data
  const recentActivity = [
    {
      type: "document_verified",
      title: "Document verified",
      detail: "Farmer certificate for Rohit Sharma",
      time: "2 minutes ago",
    },
    {
      type: "new_farmer",
      title: "New farmer registered",
      detail: "Rajesh Kumar joined as organic farmer",
      time: "1 hour ago",
    },
    {
      type: "product_added",
      title: "New product added",
      detail: "Organic rice listed by Farm Fresh Organics",
      time: "3 hours ago",
    },
    {
      type: "certificate_issued",
      title: "Certificate issued",
      detail: "Blockchain certificate #3405 issued",
      time: "5 hours ago",
    },
  ];

  // Simulated chart data
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Farmers",
        data: [8, 12, 15, 18, 22, 24],
        color: "#10b981",
      },
      {
        label: "Products",
        data: [45, 62, 80, 95, 120, 156],
        color: "#3b82f6",
      },
    ],
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "document_verified":
        return <FileCheck className="w-4 h-4 text-green-400" />;
      case "new_farmer":
        return <Users className="w-4 h-4 text-blue-400" />;
      case "product_added":
        return <Package className="w-4 h-4 text-purple-400" />;
      case "certificate_issued":
        return <ShieldCheck className="w-4 h-4 text-yellow-400" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

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

      <div className="container mx-auto px-4 pt-20 pb-12">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-1 lg:col-span-3 grid grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div className="bg-gradient-to-br from-[#1d4b3e] to-[#0f2a24] p-6 rounded-xl border border-emerald-500/30 shadow-lg shadow-emerald-900/30 hover:shadow-emerald-700/20 transition-all hover:translate-y-[-2px]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-emerald-200 font-medium text-sm">
                    Pending Documents
                  </p>
                  <h3 className="text-3xl font-bold text-white mt-1">
                    {isLoading ? (
                      <div className="h-9 w-16 bg-[#1a3a32] animate-pulse rounded"></div>
                    ) : (
                      stats.pendingDocuments
                    )}
                  </h3>
                </div>
                <div className="p-2 bg-amber-400/30 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-300" />
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
            </div>

            <div className="bg-gradient-to-br from-[#1d4b3e] to-[#0f2a24] p-6 rounded-xl border border-emerald-500/30 shadow-lg shadow-emerald-900/30 hover:shadow-emerald-700/20 transition-all hover:translate-y-[-2px]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-emerald-200 font-medium text-sm">
                    Total Farmers
                  </p>
                  <h3 className="text-3xl font-bold text-white mt-1">
                    {isLoading ? (
                      <div className="h-9 w-16 bg-[#1a3a32] animate-pulse rounded"></div>
                    ) : (
                      stats.totalFarmers
                    )}
                  </h3>
                </div>
                <div className="p-2 bg-sky-500/30 rounded-lg">
                  <Users className="w-5 h-5 text-sky-300" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mr-1"></div>
                  <p className="text-emerald-100/80 text-xs">12 new this month</p>
                </div>
                <Link
                  to="/admin/users"
                  className="text-xs flex items-center text-sky-300 hover:text-sky-200 transition-colors"
                >
                  View all <ChevronRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1d4b3e] to-[#0f2a24] p-6 rounded-xl border border-emerald-500/30 shadow-lg shadow-emerald-900/30 hover:shadow-emerald-700/20 transition-all hover:translate-y-[-2px]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-emerald-200 font-medium text-sm">
                    Total Products
                  </p>
                  <h3 className="text-3xl font-bold text-white mt-1">
                    {isLoading ? (
                      <div className="h-9 w-16 bg-[#1a3a32] animate-pulse rounded"></div>
                    ) : (
                      stats.totalProducts
                    )}
                  </h3>
                </div>
                <div className="p-2 bg-emerald-500/30 rounded-lg">
                  <Package className="w-5 h-5 text-emerald-300" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mr-1"></div>
                  <p className="text-emerald-100/80 text-xs">36 new this month</p>
                </div>
                <Link
                  to="/admin/products"
                  className="text-xs flex items-center text-emerald-300 hover:text-emerald-200 transition-colors"
                >
                  View all <ChevronRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1d4b3e] to-[#0f2a24] p-6 rounded-xl border border-emerald-500/30 shadow-lg shadow-emerald-900/30 hover:shadow-emerald-700/20 transition-all hover:translate-y-[-2px]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-emerald-200 font-medium text-sm">
                    Active Orders
                  </p>
                  <h3 className="text-3xl font-bold text-white mt-1">
                    {isLoading ? (
                      <div className="h-9 w-16 bg-[#1a3a32] animate-pulse rounded"></div>
                    ) : (
                      stats.activeOrders
                    )}
                  </h3>
                </div>
                <div className="p-2 bg-purple-500/30 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-purple-300" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mr-1"></div>
                  <p className="text-emerald-100/80 text-xs">8 need attention</p>
                </div>
                <Link
                  to="/admin/orders"
                  className="text-xs flex items-center text-purple-300 hover:text-purple-200 transition-colors"
                >
                  View all <ChevronRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1d4b3e] to-[#0f2a24] p-6 rounded-xl border border-emerald-500/30 shadow-lg shadow-emerald-900/30 hover:shadow-emerald-700/20 transition-all hover:translate-y-[-2px]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-emerald-200 font-medium text-sm">
                    Certificates Issued
                  </p>
                  <h3 className="text-3xl font-bold text-white mt-1">
                    {isLoading ? (
                      <div className="h-9 w-16 bg-[#1a3a32] animate-pulse rounded"></div>
                    ) : (
                      stats.certificatesIssued
                    )}
                  </h3>
                </div>
                <div className="p-2 bg-yellow-500/30 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-yellow-300" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mr-1"></div>
                  <p className="text-emerald-100/80 text-xs">All valid and active</p>
                </div>
                <Link
                  to="/admin/certificates"
                  className="text-xs flex items-center text-yellow-300 hover:text-yellow-200 transition-colors"
                >
                  View all <ChevronRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1d4b3e] to-[#0f2a24] p-6 rounded-xl border border-emerald-500/30 shadow-lg shadow-emerald-900/30 hover:shadow-emerald-700/20 transition-all hover:translate-y-[-2px]">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-emerald-200 font-medium text-sm">
                    Total Revenue
                  </p>
                  <h3 className="text-3xl font-bold text-white mt-1">
                    {isLoading ? (
                      <div className="h-9 w-36 bg-[#1a3a32] animate-pulse rounded"></div>
                    ) : (
                      formatCurrency(stats.totalRevenue)
                    )}
                  </h3>
                </div>
                <div className="p-2 bg-teal-500/30 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-teal-300" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mr-1"></div>
                  <p className="text-emerald-100/80 text-xs">+18% from last month</p>
                </div>
                <Link
                  to="/admin/finance"
                  className="text-xs flex items-center text-teal-300 hover:text-teal-200 transition-colors"
                >
                  View report <ChevronRight className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>
          </motion.div>
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