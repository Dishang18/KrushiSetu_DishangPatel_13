import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, FileCheck, FileX, AlertCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../context/axiosInstance';

function DocumentUpload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log(user)
  const [farmerDocs, setFarmerDocs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  // Fetch existing documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        if (!user || !user._id) return;
        
        setLoading(true);
        setError(null);
        
        const response = await axiosInstance.get(
          `/documents/farmer/${user._id}`
        );
        console.log("Document data:", response.data);
        setFarmerDocs(response.data);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to load your documents. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [user]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'aadhaar') {
        setAadhaarFile(file);
      } else {
        setCertificateFile(file);
      }
    }
  };

  // New function to upload both files at once
  const uploadBothDocuments = async () => {
    try {
      if (!user || !user._id) {
        throw new Error('User ID is missing');
      }
      
      const formData = new FormData();
      
      if (aadhaarFile) {
        formData.append('aadhaarDocument', aadhaarFile);
      }
      
      if (certificateFile) {
        formData.append('certificateDocument', certificateFile);
      }
      
      formData.append('farmerId', user._id);
      
      const response = await axiosInstance.post(
        '/documents/upload-both',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error uploading documents:', error);
      throw error;
    }
  };

  const uploadDocument = async (file, documentType) => {
    try {
      if (!user || !user._id) {
        throw new Error('User ID is missing');
      }
      
      const formData = new FormData();
      formData.append('document', file);
      formData.append('documentType', documentType);
      formData.append('farmerId', user._id);
      
      const response = await axiosInstance.post(
        '/documents/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error(`Error uploading ${documentType} document:`, error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadSuccess(null);
    setUploadError(null);
    
    try {
      if (!aadhaarFile && !certificateFile) {
        setUploadError('Please select at least one document to upload.');
        setUploading(false);
        return;
      }
      
      let result;
      
      // If both files are selected, use the combined upload endpoint
      if (aadhaarFile && certificateFile) {
        result = await uploadBothDocuments();
        setUploadSuccess('Both documents uploaded successfully!');
      } else {
        // Otherwise use the individual upload endpoints
        const uploads = [];
        
        if (aadhaarFile) {
          uploads.push(uploadDocument(aadhaarFile, 'aadhaar'));
        }
        
        if (certificateFile) {
          uploads.push(uploadDocument(certificateFile, 'certificate'));
        }
        
        await Promise.all(uploads);
        setUploadSuccess('Document uploaded successfully!');
      }
      
      // Clear file inputs
      setAadhaarFile(null);
      setCertificateFile(null);
      
      // Refresh the document list
      const response = await axiosInstance.get(
        `/documents/farmer/${user._id}`
      );
      
      
      setFarmerDocs(response.data);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload documents. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getDocumentStatus = (type) => {
    if (!farmerDocs || !farmerDocs.documents) return 'not_uploaded';
    
    const doc = farmerDocs.documents[type];
    return doc ? doc.status : 'not_uploaded';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      case 'pending': return 'text-yellow-500';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <FileCheck className="w-6 h-6 text-green-500" />;
      case 'rejected': return <FileX className="w-6 h-6 text-red-500" />;
      case 'pending': return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      default: return <Upload className="w-6 h-6 text-gray-400" />;
    }
  };

  const hasBlockchainCertificate = () => {
    return farmerDocs && farmerDocs.certificateId && farmerDocs.blockchainTxId;
  };

  const viewCertificate = () => {
    if (farmerDocs && farmerDocs.certificateId) {
      navigate(`/farmer/certificate/${farmerDocs.certificateId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a332e]">
      <Navbar />
      <div className="pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            to="/farmer/dashboard"
            className="inline-flex items-center text-teal-400 hover:text-teal-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>

          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Identity Verification</h1>
            <p className="text-gray-400">Upload your identity documents to get verified as a farmer</p>
          </motion.div>

          {/* Certificate Status */}
          {hasBlockchainCertificate() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 rounded-xl bg-teal-500/20 border border-teal-500/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">Farmer Certificate Issued!</h2>
                  <p className="text-gray-300">Your identity has been verified and a blockchain certificate has been issued to you.</p>
                </div>
                <button
                  onClick={viewCertificate}
                  className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
                >
                  View Certificate
                </button>
              </div>
            </motion.div>
          )}

          {/* Document Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-xl bg-[#2d4f47] border border-teal-500/20"
          >
            <h2 className="text-xl font-bold text-white mb-4">Document Status</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Aadhaar Card Status */}
              <div className="bg-[#1a332e] p-4 rounded-lg border border-teal-500/10">
                <div className="flex items-center">
                  {getStatusIcon(getDocumentStatus('aadhaar'))}
                  <div className="ml-3">
                    <h3 className="text-white font-semibold">Aadhaar Card</h3>
                    <p className={`${getStatusColor(getDocumentStatus('aadhaar'))} capitalize`}>
                      {getDocumentStatus('aadhaar') === 'not_uploaded' ? 'Not Uploaded' : getDocumentStatus('aadhaar')}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Certificate Status */}
              <div className="bg-[#1a332e] p-4 rounded-lg border border-teal-500/10">
                <div className="flex items-center">
                  {getStatusIcon(getDocumentStatus('certificate'))}
                  <div className="ml-3">
                    <h3 className="text-white font-semibold">Farmer Certificate</h3>
                    <p className={`${getStatusColor(getDocumentStatus('certificate'))} capitalize`}>
                      {getDocumentStatus('certificate') === 'not_uploaded' ? 'Not Uploaded' : getDocumentStatus('certificate')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {farmerDocs && farmerDocs.verificationStatus && (
              <div className="mt-4 pt-4 border-t border-teal-500/10">
                <p className="text-gray-300">
                  <span className="font-medium">Overall Status:</span> 
                  <span className={`ml-2 capitalize ${
                    farmerDocs.verificationStatus === 'certified' ? 'text-green-400' : 
                    farmerDocs.verificationStatus === 'complete' ? 'text-blue-400' : 
                    farmerDocs.verificationStatus === 'rejected' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {farmerDocs.verificationStatus}
                  </span>
                </p>
              </div>
            )}
          </motion.div>

          {/* Upload Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-8 mb-12"
          >
            <div className="bg-[#2d4f47] rounded-xl p-6 border border-teal-500/20">
              <h2 className="text-xl font-bold text-white mb-6">Upload Documents</h2>
              <p className="text-gray-300 mb-6">For verification, you need to upload <strong>both</strong> your Aadhaar card and government-issued farmer certificate.</p>
              
              {/* Upload Messages */}
              {uploadSuccess && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300">
                  {uploadSuccess}
                </div>
              )}
              
              {uploadError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
                  {uploadError}
                </div>
              )}
              
              <div className="space-y-6">
                {/* Aadhaar Upload */}
                <div>
                  <label className="block text-white font-medium mb-2">Aadhaar Card <span className="text-red-400">*</span></label>
                  <div className="border-2 border-dashed border-teal-500/20 rounded-xl p-6">
                    <div className="text-center">
                      {aadhaarFile ? (
                        <div className="mb-2 text-teal-300">{aadhaarFile.name}</div>
                      ) : (
                        <Upload className="w-10 h-10 text-teal-400 mx-auto mb-2" />
                      )}
                      <p className="text-gray-300 mb-2">Upload your Aadhaar card</p>
                      <p className="text-gray-400 text-sm mb-4">PDF or image file (max 5MB)</p>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileChange(e, 'aadhaar')}
                        className="hidden"
                        id="aadhaar-upload"
                      />
                      <label
                        htmlFor="aadhaar-upload"
                        className="inline-block bg-teal-500/20 text-teal-300 px-4 py-2 rounded-lg cursor-pointer hover:bg-teal-500/30 transition-colors"
                      >
                        {aadhaarFile ? 'Change File' : 'Select File'}
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Certificate Upload */}
                <div>
                  <label className="block text-white font-medium mb-2">Government Farmer Certificate <span className="text-red-400">*</span></label>
                  <div className="border-2 border-dashed border-teal-500/20 rounded-xl p-6">
                    <div className="text-center">
                      {certificateFile ? (
                        <div className="mb-2 text-teal-300">{certificateFile.name}</div>
                      ) : (
                        <Upload className="w-10 h-10 text-teal-400 mx-auto mb-2" />
                      )}
                      <p className="text-gray-300 mb-2">Upload your government-issued farmer certificate</p>
                      <p className="text-gray-400 text-sm mb-4">PDF or image file (max 5MB)</p>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileChange(e, 'certificate')}
                        className="hidden"
                        id="certificate-upload"
                      />
                      <label
                        htmlFor="certificate-upload"
                        className="inline-block bg-teal-500/20 text-teal-300 px-4 py-2 rounded-lg cursor-pointer hover:bg-teal-500/30 transition-colors"
                      >
                        {certificateFile ? 'Change File' : 'Select File'}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={uploading || (!aadhaarFile && !certificateFile)}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  uploading || (!aadhaarFile && !certificateFile) 
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                    : 'bg-teal-500 text-white hover:bg-teal-600'
                }`}
              >
                {uploading ? 'Uploading...' : aadhaarFile && certificateFile ? 'Upload Both Documents' : 'Upload Document'}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

export default DocumentUpload;
