import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import useAuth from '../../hooks/useAuth';
import { 
  Package, 
  ShoppingCart, 
  BarChart2, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import axiosInstance from '../../context/axiosInstance';

function FarmerDashboard() {
  const { user } = useAuth();
  console.log(user);
  const [farmerName, setFarmerName] = useState('');
  const [documentStatus, setDocumentStatus] = useState({
    aadhaar: 'not_uploaded',
    certificate: 'not_uploaded',
    blockchain: false
  });
  
  // Fetch user data and document status
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setFarmerName(user.name || 'Farmer');
        
        try {
          // Fetch document status
          const response = await axiosInstance.get(
            `/documents/farmer/${user.id}`
          );
          
          const docs = response.data;
          const status = {
            aadhaar: 'not_uploaded',
            certificate: 'not_uploaded',
            blockchain: false
          };
          
          docs.forEach(doc => {
            if (doc.documentType === 'aadhaar') {
              status.aadhaar = doc.status;
            }
            if (doc.documentType === 'certificate') {
              status.certificate = doc.status;
            }
            if (doc.certificateId && doc.blockchainTxId) {
              status.blockchain = true;
            }
          });
          
          setDocumentStatus(status);
        } catch (error) {
          console.error('Error fetching documents:', error);
        }
      }
    };
    
    fetchUserData();
  }, [user]);

  const getVerificationStatus = () => {
    if (documentStatus.blockchain) {
      return {
        status: 'verified',
        text: 'Blockchain Certificate Issued',
        icon: <FileCheck className="w-5 h-5 mr-3 text-green-400" />,
        color: 'bg-green-500/20 text-green-400'
      };
    } 
    
    if (documentStatus.aadhaar === 'verified' && documentStatus.certificate === 'verified') {
      return {
        status: 'pending',
        text: 'Documents Verified - Certificate Pending',
        icon: <CheckCircle className="w-5 h-5 mr-3 text-yellow-400" />,
        color: 'bg-yellow-500/20 text-yellow-400'
      };
    }
    
    if (documentStatus.aadhaar === 'pending' || documentStatus.certificate === 'pending') {
      return {
        status: 'pending',
        text: 'Verification Pending',
        icon: <AlertCircle className="w-5 h-5 mr-3 text-yellow-400" />,
        color: 'bg-yellow-500/20 text-yellow-400'
      };
    }
    
    if (documentStatus.aadhaar === 'not_uploaded' || documentStatus.certificate === 'not_uploaded') {
      return {
        status: 'missing',
        text: 'Documents Not Uploaded',
        icon: <FileText className="w-5 h-5 mr-3 text-gray-400" />,
        color: 'bg-gray-500/20 text-gray-400'
      };
    }
    
    return {
      status: 'unknown',
      text: 'Document Status Unknown',
      icon: <AlertCircle className="w-5 h-5 mr-3 text-gray-400" />,
      color: 'bg-gray-500/20 text-gray-400'
    };
  };

  const verificationStatus = getVerificationStatus();
  
  return (
    <div className="min-h-screen bg-[#1a332e]">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome, {farmerName}
          </h1>
          <p className="text-gray-400">
            Manage your farm products and view your sales
          </p>
        </motion.div>

        {/* Verification Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className={`p-4 rounded-lg flex items-center ${verificationStatus.color}`}>
            {verificationStatus.icon}
            <span className="font-medium">{verificationStatus.text}</span>
            
            {verificationStatus.status !== 'verified' && (
              <Link 
                to="/farmer/documents" 
                className="ml-auto bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 px-4 py-2 rounded-lg transition-colors"
              >
                {documentStatus.aadhaar === 'not_uploaded' || documentStatus.certificate === 'not_uploaded' 
                  ? 'Upload Documents' 
                  : 'View Status'}
              </Link>
            )}
            
            {verificationStatus.status === 'verified' && (
              <Link 
                to="/farmer/certificate" 
                className="ml-auto bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 px-4 py-2 rounded-lg transition-colors"
              >
                View Certificate
              </Link>
            )}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/farmer/products">
              <div className="bg-[#2d4f47] hover:bg-[#2a4941] p-6 rounded-xl flex flex-col items-center justify-center text-center transition-colors border border-teal-500/10 h-full">
                <Package className="w-8 h-8 text-teal-400 mb-3" />
                <h3 className="text-white font-medium mb-1">Products</h3>
                <p className="text-gray-400 text-sm">Manage your farm products</p>
              </div>
            </Link>
            <Link to="/farmer/documents">
              <div className="bg-[#2d4f47] hover:bg-[#2a4941] p-6 rounded-xl flex flex-col items-center justify-center text-center transition-colors border border-teal-500/10 h-full">
                <FileText className="w-8 h-8 text-teal-400 mb-3" />
                <h3 className="text-white font-medium mb-1">Documents</h3>
                <p className="text-gray-400 text-sm">Upload & manage verification</p>
              </div>
            </Link>
            <Link to="/farmer/orders">
              <div className="bg-[#2d4f47] hover:bg-[#2a4941] p-6 rounded-xl flex flex-col items-center justify-center text-center transition-colors border border-teal-500/10 h-full">
                <ShoppingCart className="w-8 h-8 text-teal-400 mb-3" />
                <h3 className="text-white font-medium mb-1">Orders</h3>
                <p className="text-gray-400 text-sm">View and fulfill orders</p>
              </div>
            </Link>
            <Link to="/farmer/analytics">
              <div className="bg-[#2d4f47] hover:bg-[#2a4941] p-6 rounded-xl flex flex-col items-center justify-center text-center transition-colors border border-teal-500/10 h-full">
                <BarChart2 className="w-8 h-8 text-teal-400 mb-3" />
                <h3 className="text-white font-medium mb-1">Analytics</h3>
                <p className="text-gray-400 text-sm">Track your sales data</p>
              </div>
            </Link>
          </div>
        </motion.div>
        
        {/* Additional dashboard content can be added here */}
      </div>
    </div>
  );
}

export default FarmerDashboard;
