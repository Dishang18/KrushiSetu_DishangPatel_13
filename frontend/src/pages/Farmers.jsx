import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { Search, Filter, User, ExternalLink, Eye, Clock, Check, AlertCircle, ShieldCheck, X, Download, Calendar, FileCheck } from 'lucide-react';
import axiosInstance from '../context/axiosInstance';
import useAuth from '../hooks/useAuth';
import { motion } from 'framer-motion';

function Farmers() {
  const { user } = useAuth();
  const [farmers, setFarmers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationLoading, setVerificationLoading] = useState(false);

  useEffect(() => {
    fetchFarmers();
  }, [searchQuery, filter]);

  const fetchFarmers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      
      if (user?.token && user.role === 'admin') {
        // Admin users get full access through the authenticated endpoint
        response = await axiosInstance.get('/certificates/statistics', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        
        let allFarmers = [];
        if (response.data?.farmers) {
          if (filter === 'all') {
            Object.values(response.data.farmers).forEach(category => {
              if (Array.isArray(category)) {
                allFarmers = [...allFarmers, ...category];
              }
            });
          } else {
            allFarmers = response.data.farmers[filter] || [];
          }
        }
        setFarmers(allFarmers);
      } else {
        // Public and non-admin users use the public endpoint
        response = await axiosInstance.get('/certificates/public/farmers');
        let allFarmers = response.data || [];
        
        // Filter to show only verified and certified farmers for non-admin users
        allFarmers = allFarmers.filter(farmer => 
          farmer.verificationStatus === 'complete' || 
          farmer.verificationStatus === 'verified' || 
          farmer.verificationStatus === 'certified'
        );

        // Apply search filter if needed
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          allFarmers = allFarmers.filter(farmer => 
            farmer.name?.toLowerCase().includes(query) || 
            farmer.email?.toLowerCase().includes(query)
          );
        }
        
        setFarmers(allFarmers);
      }
    } catch (error) {
      console.error('Error fetching farmers:', error);
      setError('Failed to fetch farmers. Please try again later.');
      setFarmers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'certified':
        return (
          <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs flex items-center">
            <ShieldCheck className="w-3 h-3 mr-1" /> Certified
          </span>
        );
      case 'verified':
      case 'complete':
        return (
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs flex items-center">
            <Check className="w-3 h-3 mr-1" /> Verified
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs flex items-center">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-500/20 text-gray-300 rounded-full text-xs flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" /> Unknown
          </span>
        );
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setSearchQuery(e.target.value);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const viewFarmerDetails = (farmer) => {
    setSelectedFarmer(farmer);
    setVerificationResult(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFarmer(null);
    setVerificationResult(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f1a] via-[#0a2018] to-[#0c2a22]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {!user?.token ? 'Verified Farmers' : (user.role === 'admin' ? 'All Farmers' : 'Verified Farmers')}
            </h1>
            <p className="text-gray-400">
              {!user?.token || user.role !== 'admin'
                ? 'View all verified farmers in our network'
                : 'View and manage all registered farmers'
              }
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-[#1c3631] p-4 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by farmer name or email..."
                className="w-full bg-[#0f201c] text-white pl-10 pr-4 py-2 rounded-lg border border-[#2d4f47] focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                onKeyDown={handleSearch}
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            
            {user?.token && user.role === 'admin' && (
              <div className="relative">
                <select
                  className="bg-[#0f201c] text-white pl-4 pr-10 py-2 rounded-lg border border-[#2d4f47] focus:outline-none focus:ring-2 focus:ring-teal-500/50 appearance-none"
                  value={filter}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Farmers</option>
                  <option value="certified">Certified</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                </select>
                <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                      </div>
                    )}
                  </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 text-red-300 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Farmers Table */}
        <div className="bg-[#1c3631] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2d4f47]">
                <th className="text-left text-xs font-medium text-teal-300 uppercase tracking-wider px-6 py-3">
                  Farmer Name
                </th>
                <th className="text-left text-xs font-medium text-teal-300 uppercase tracking-wider px-6 py-3">
                  Email
                </th>
                <th className="text-left text-xs font-medium text-teal-300 uppercase tracking-wider px-6 py-3">
                  Farm Type
                </th>
                <th className="text-left text-xs font-medium text-teal-300 uppercase tracking-wider px-6 py-3">
                  Status
                </th>
                {/* <th className="text-left text-xs font-medium text-teal-300 uppercase tracking-wider px-6 py-3">
                  Certificate
                </th> */}
                <th className="text-left text-xs font-medium text-teal-300 uppercase tracking-wider px-6 py-3">
                Certificate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d4f47]">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : farmers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                    No farmers found
                  </td>
                </tr>
              ) : (
                farmers.map((farmer) => (
                  <tr key={farmer._id || farmer.id} className="hover:bg-[#2d4f47]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-teal-300" />
                        </div>
                        <span className="text-white font-medium">{farmer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {farmer.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                        {farmer.farmType || "Organic"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(farmer.verificationStatus || farmer.status)}
                    </td>
                    {/* <td className="px-6 py-4">
                      {farmer.certificateId ? (
                        <Link 
                          to={`/farmer/certificate/${farmer.certificateId}`}
                          className="text-teal-400 hover:text-teal-300 flex items-center"
                        >
                          View <ExternalLink className="ml-1 w-3 h-3" />
                        </Link>
                      ) : (
                        <span className="text-gray-500">None</span>
                      )}
                    </td> */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => viewFarmerDetails(farmer)}
                        className="text-teal-400 hover:text-teal-300 flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" /> Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
                      </div>
                    </div>
                    
      {/* Farmer Details Modal */}
      {showModal && selectedFarmer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#386259] to-[#2d4f47] rounded-xl border border-teal-500/20 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b border-teal-500/20">
              <h3 className="text-xl font-bold text-white">Farmer Details</h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6 p-6 bg-gradient-to-br from-[#2d4f47] to-[#1e3831] rounded-lg border border-teal-500/10">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-teal-300 font-semibold">Farmer Profile</h4>
                  {getStatusBadge(selectedFarmer.verificationStatus || selectedFarmer.status)}
                    </div>

                <div className="text-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-3">
                    <User className="w-10 h-10 text-teal-300" />
                  </div>
                  <h3 className="text-white text-2xl font-bold mb-1">{selectedFarmer.name}</h3>
                  <p className="text-gray-300 text-sm">{selectedFarmer.farmType || 'Organic'} Farmer</p>
                    </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Farmer ID</p>
                    <p className="text-white">{selectedFarmer._id || selectedFarmer.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Email</p>
                    <p className="text-white">{selectedFarmer.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Farm Type</p>
                    <p className="text-white">{selectedFarmer.farmType || 'Organic'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Status</p>
                    <p className="text-white">{selectedFarmer.verificationStatus || selectedFarmer.status}</p>
                  </div>
                  {selectedFarmer.certificateId && (
                    <div className="col-span-2">
                      <p className="text-gray-400 text-xs mb-1">Certificate ID</p>
                      <p className="text-white flex items-center">
                        {selectedFarmer.certificateId}
                        <Link 
                          to={`/farmer/certificate/${selectedFarmer.certificateId}`}
                          className="ml-2 text-teal-400 hover:text-teal-300 inline-flex items-center"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </p>
                    </div>
                  )}
                      </div>
                    </div>

              {selectedFarmer.certificateId && (
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-3">Certificate Details</h4>
                  <Link
                    to={`/farmer/certificate/${selectedFarmer.certificateId}`}
                    className="w-full py-3 rounded-lg flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white transition-colors"
                  >
                    <FileCheck className="w-5 h-5 mr-2" />
                    View Full Certificate
                  </Link>
                  </div>
              )}
              
              <div className="flex justify-between">
                <button 
                  onClick={closeModal}
                  className="px-4 py-2 border border-teal-500/30 rounded-lg text-white hover:bg-teal-500/20 transition-colors"
                >
                  Close
                </button>
                {selectedFarmer.certificateId && (
                  <button 
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg text-white transition-colors flex items-center"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Details
                  </button>
                )}
          </div>
        </div>
          </motion.div>
      </div>
      )}
    </div>
  );
}

export default Farmers;