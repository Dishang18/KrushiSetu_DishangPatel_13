import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../context/axiosInstance';
import {
  Users,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  User,
  ShieldCheck,
  Check,
  X,
  ExternalLink,
  AlertCircle,
  Clock,
  FileText,
  Mail,
  Phone,
  Eye
} from 'lucide-react';

const Farmers = () => {
  const { user } = useAuth();
  const [farmers, setFarmers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState(null);
  
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchFarmers();
    fetchStatistics();
  }, [currentPage, searchQuery, filter]);

  const fetchStatistics = async () => {
    try {
      const response = await axiosInstance.get('/certificates/statistics');
      console.log(response.data);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Fallback stats if API fails
      setStats({
        totalFarmers: 0,
        verified: 0,
        pending: 0,
        partial: 0,
        rejected: 0,
        certified: 0,
        notUploaded: 0
      });
    }
  };

  const fetchFarmers = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, we would fetch from the API with pagination and filtering
      const response = await axiosInstance.get('/certificates/statistics');
      console.log(response.data);
      
      // Extract farmers from different categories based on filter
      let allFarmers = [];
      if (filter === 'all') {
        // Combine all farmers from different categories
        Object.values(response.data.farmers).forEach(category => {
          allFarmers = [...allFarmers, ...category];
        });
      } else {
        // Only get farmers from the selected category
        allFarmers = response.data.farmers[filter] || [];
      }
      
      // Apply search filter if needed
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        allFarmers = allFarmers.filter(farmer => 
          farmer.name.toLowerCase().includes(query) || 
          farmer.email.toLowerCase().includes(query)
        );
      }
      
      setFarmers(allFarmers);
      setTotalPages(Math.ceil(allFarmers.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching farmers:', error);
      // Use sample data for development
      setFarmers(generateSampleFarmers());
      setTotalPages(Math.ceil(generateSampleFarmers().length / ITEMS_PER_PAGE));
    } finally {
      setIsLoading(false);
    }
  };

  const generateSampleFarmers = () => {
    const statuses = ['verified', 'pending', 'partial', 'rejected', 'certified', 'notUploaded'];
    const farmTypes = ['Organic', 'Natural', 'Pesticide-free', 'Biodynamic', 'Permaculture'];
    const phoneNumbers = ['+91 9876543210', '+91 8765432109', '+91 7654321098', '+91 6543210987'];
    
    return Array.from({ length: 25 }, (_, i) => {
      const firstName = ['Rajesh', 'Priya', 'Mohit', 'Aditya', 'Neha', 'Sanjay', 'Kavita', 'Amit', 'Lakshmi', 'Rahul'][i % 10];
      const lastName = ['Kumar', 'Singh', 'Verma', 'Sharma', 'Patel', 'Gupta', 'Jain', 'Mishra', 'Devi', 'Iyer'][i % 10];
      const name = `${firstName} ${lastName}`;
      
      return {
        id: `farmer_${i + 1}`,
        name: name,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        phoneNumber: phoneNumbers[i % phoneNumbers.length],
        verificationStatus: statuses[i % statuses.length],
        farmType: farmTypes[i % farmTypes.length],
        uploadDate: new Date(Date.now() - Math.random() * 10000000000),
        certificateId: i % 3 === 0 ? `CERT-${100 + i}` : null
      };
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setSearchQuery(e.target.value);
      setCurrentPage(1);
    }
  };

  const viewFarmerDetails = (farmer) => {
    setSelectedFarmer(farmer);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFarmer(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderPagination = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    // Always show 5 page numbers if possible
    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + 4);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - 4);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-400">
          Showing {isLoading ? '...' : `${(currentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(currentPage * ITEMS_PER_PAGE, farmers.length)} of ${farmers.length}`} farmers
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-md ${
              currentPage === 1
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-teal-400 hover:bg-teal-500/10'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                currentPage === number
                  ? 'bg-teal-500 text-white'
                  : 'text-gray-400 hover:bg-teal-500/10 hover:text-white'
              }`}
            >
              {number}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md ${
              currentPage === totalPages
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-teal-400 hover:bg-teal-500/10'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
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
      case 'partial':
        return (
          <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs flex items-center">
            <FileText className="w-3 h-3 mr-1" /> Partial
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs flex items-center">
            <X className="w-3 h-3 mr-1" /> Rejected
          </span>
        );
      case 'notUploaded':
        return (
          <span className="px-3 py-1 bg-gray-500/20 text-gray-300 rounded-full text-xs flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" /> No Documents
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-500/20 text-gray-300 rounded-full text-xs">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#081210] via-[#071512] to-[#061411]">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Verified Farmers
            </h1>
            <p className="text-gray-400">
              Manage and view all farmers and their verification status
            </p>
          </motion.div>
        </div>
        
        {/* Statistics Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-[#386259] to-[#2d4f47] rounded-xl border border-teal-500/20 shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Total Farmers</h3>
              <Users className="h-5 w-5 text-teal-300" />
            </div>
            <p className="text-3xl font-bold text-white">{stats?.totalFarmers || 0}</p>
            <p className="text-gray-400 text-xs mt-2">Registered farmers</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#386259] to-[#2d4f47] rounded-xl border border-teal-500/20 shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Certified</h3>
              <ShieldCheck className="h-5 w-5 text-green-300" />
            </div>
            <p className="text-3xl font-bold text-white">{stats?.certified || 0}</p>
            <p className="text-gray-400 text-xs mt-2">With blockchain certificates</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#386259] to-[#2d4f47] rounded-xl border border-teal-500/20 shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Verified</h3>
              <Check className="h-5 w-5 text-blue-300" />
            </div>
            <p className="text-3xl font-bold text-white">{stats?.verified || 0}</p>
            <p className="text-gray-400 text-xs mt-2">Documents verified</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#386259] to-[#2d4f47] rounded-xl border border-teal-500/20 shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Pending</h3>
              <Clock className="h-5 w-5 text-yellow-300" />
            </div>
            <p className="text-3xl font-bold text-white">{stats?.pending || 0}</p>
            <p className="text-gray-400 text-xs mt-2">Awaiting verification</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#386259] to-[#2d4f47] rounded-xl border border-teal-500/20 shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Partial</h3>
              <FileText className="h-5 w-5 text-orange-300" />
            </div>
            <p className="text-3xl font-bold text-white">{stats?.partial || 0}</p>
            <p className="text-gray-400 text-xs mt-2">Incomplete submission</p>
          </div>
          
          <div className="bg-gradient-to-br from-[#386259] to-[#2d4f47] rounded-xl border border-teal-500/20 shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">No Documents</h3>
              <AlertCircle className="h-5 w-5 text-gray-300" />
            </div>
            <p className="text-3xl font-bold text-white">{stats?.notUploaded || 0}</p>
            <p className="text-gray-400 text-xs mt-2">No documents uploaded</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#386259] to-[#2d4f47] p-6 rounded-xl border border-teal-500/20 shadow-lg shadow-black/20 mb-8"
        >
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by farmer name or email..."
                className="w-full bg-[#1c3631] text-white pl-10 pr-4 py-2 rounded-lg border border-[#2d4f47] focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                onKeyDown={handleSearch}
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  className="bg-[#1c3631] text-white pl-4 pr-10 py-2 rounded-lg border border-[#2d4f47] focus:outline-none focus:ring-2 focus:ring-teal-500/50 appearance-none"
                  value={filter}
                  onChange={handleFilterChange}
                >
                  <option value="all">All Farmers</option>
                  <option value="certified">Certified</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="rejected">Rejected</option>
                  <option value="notUploaded">No Documents</option>
                </select>
                <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
          
          {/* Farmers Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-teal-500/10 text-white">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-teal-300 uppercase tracking-wider">
                    Farmer Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-teal-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-teal-300 uppercase tracking-wider">
                    Farm Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-teal-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-teal-300 uppercase tracking-wider">
                    Certificate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-teal-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-500/10">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="bg-teal-500/5 animate-pulse">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="h-5 w-32 bg-gray-700 rounded"></div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="h-5 w-40 bg-gray-700 rounded"></div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="h-5 w-20 bg-gray-700 rounded"></div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="h-5 w-20 bg-gray-700 rounded"></div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="h-5 w-16 bg-gray-700 rounded"></div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="h-5 w-20 bg-gray-700 rounded"></div>
                      </td>
                    </tr>
                  ))
                ) : farmers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                      No farmers found.
                    </td>
                  </tr>
                ) : (
                  farmers
                    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
                    .map((farmer) => (
                      <tr 
                        key={farmer.id} 
                        className="hover:bg-teal-500/10 transition-colors"
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center mr-3">
                              <User className="w-4 h-4 text-teal-300" />
                            </div>
                            <span className="font-medium">{farmer.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-gray-300">
                          {farmer.email}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                            {farmer.farmType || "Unknown"}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {getStatusBadge(farmer.verificationStatus)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-gray-300">
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
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => viewFarmerDetails(farmer)}
                            className="text-teal-300 hover:text-teal-200 transition-colors flex items-center"
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
          
          {/* Pagination */}
          {renderPagination()}
        </motion.div>
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
                  <h4 className="text-teal-300 font-semibold">Farmer ID: {selectedFarmer.id}</h4>
                  {getStatusBadge(selectedFarmer.verificationStatus)}
                </div>
                
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-3">
                    <User className="w-10 h-10 text-teal-300" />
                  </div>
                  <h3 className="text-white text-2xl font-bold mb-1">{selectedFarmer.name}</h3>
                  <p className="text-gray-300 text-sm">{selectedFarmer.farmType || "Unknown"} Farmer</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-gray-400 text-xs">Email Address</p>
                      <p className="text-white">{selectedFarmer.email}</p>
                    </div>
                  </div>
                  
                  {selectedFarmer.phoneNumber && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-gray-400 text-xs">Phone Number</p>
                        <p className="text-white">{selectedFarmer.phoneNumber}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-gray-400 text-xs">Document Status</p>
                      <p className="text-white flex items-center mt-1">
                        {getStatusBadge(selectedFarmer.verificationStatus)}
                      </p>
                    </div>
                  </div>
                  
                  {selectedFarmer.uploadDate && (
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-gray-400 text-xs">Documents Uploaded</p>
                        <p className="text-white">{formatDate(selectedFarmer.uploadDate)}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedFarmer.certificateId && (
                    <div className="flex items-center">
                      <ShieldCheck className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-gray-400 text-xs">Certificate ID</p>
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
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between">
                <button 
                  onClick={closeModal}
                  className="px-4 py-2 border border-teal-500/30 rounded-lg text-white hover:bg-teal-500/20 transition-colors"
                >
                  Close
                </button>
                
                {selectedFarmer.verificationStatus === 'pending' && (
                  <Link 
                    to="/admin/verify-documents"
                    className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg text-white transition-colors flex items-center"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Verify Documents
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Farmers;
