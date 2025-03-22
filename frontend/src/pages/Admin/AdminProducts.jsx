import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllFarmersWithProductCounts,
  getFarmerProducts,
  getProductDetails
} from '../../redux/slices/ProductSlice';
import Navbar from '../../components/Navbar';
import {
  Users,
  Package,
  Search,
  ShieldCheck,
  ArrowLeft,
  Tag,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Edit
} from 'lucide-react';

const AdminProducts = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState('farmers'); // 'farmers', 'products', 'product-details'
  const [currentPage, setCurrentPage] = useState(1);

  // Get data from Redux store
  const { 
    farmers = [], 
    farmerProducts = [], 
    currentProduct = null,
    pagination = { total: 0, page: 1, pages: 1, limit: 6 },
    loading = false, 
    error = null 
  } = useSelector((state) => {
    return {
      farmers: state.products.farmers?.farmers || state.products.farmers || [],
      farmerProducts: state.products.farmerProducts || [],
      currentProduct: state.products.currentProduct,
      pagination: state.products.pagination || { total: 0, page: 1, pages: 1, limit: 6 },
      loading: state.products.loading,
      error: state.products.error
    };
  });

  // Fetch all farmers with product counts when component loads
  useEffect(() => {
    dispatch(getAllFarmersWithProductCounts())
      .then(response => {
        console.log("API response:", response);
      })
      .catch(error => {
        console.error("Error fetching farmers:", error);
      });
  }, [dispatch]);

  // Filter farmers based on search term
  const filteredFarmers = searchTerm
    ? farmers.filter(farmer => 
        farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        farmer._id.includes(searchTerm)
      )
    : farmers;

  const handleFarmerClick = (farmer) => {
    setSelectedFarmer(farmer);
    setCurrentPage(1); // Reset to page 1 when selecting a new farmer
    dispatch(getFarmerProducts({ 
      farmerId: farmer._id,
      page: 1,
      limit: 6
    }));
    setViewMode('products');
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    dispatch(getProductDetails(product._id));
    setViewMode('product-details');
  };

  const handleBackToFarmers = () => {
    setSelectedFarmer(null);
    setViewMode('farmers');
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
    setViewMode('products');
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages || newPage === pagination.page) {
      return; // Don't make unnecessary API calls
    }
    
    setCurrentPage(newPage);
    dispatch(getFarmerProducts({
      farmerId: selectedFarmer._id,
      page: newPage,
      limit: pagination.limit
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Display loading state
  if (loading && viewMode === 'farmers' && farmers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1f1a] via-[#0a2018] to-[#0c2a22]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f1a] via-[#0a2018] to-[#0c2a22]">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center mb-2">
            {viewMode !== 'farmers' && (
              <button
                onClick={viewMode === 'products' ? handleBackToFarmers : handleBackToProducts}
                className="mr-3 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {viewMode === 'farmers' && 'Verified Farmers & Products'}
              {viewMode === 'products' && selectedFarmer?.name + "'s Products"}
              {viewMode === 'product-details' && 'Product Details'}
            </h1>
          </div>
          <p className="text-emerald-300">
            {viewMode === 'farmers' && 'Manage verified farmers and their products'}
            {viewMode === 'products' && `Showing ${farmerProducts.length} of ${pagination.total} products`}
            {viewMode === 'product-details' && selectedProduct?.name}
          </p>
        </motion.div>

        {/* Search Bar - Only show on farmers and products view */}
        {viewMode !== 'product-details' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 relative"
          >
            <input
              type="text"
              placeholder={
                viewMode === 'farmers' 
                  ? "Search farmers by name or ID..." 
                  : "Search products by name or ID..."
              }
              className="w-full bg-[#193d33] text-white pl-10 pr-4 py-3 rounded-lg border border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-5 h-5 text-emerald-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 text-red-300 p-4 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Farmers List View */}
        {viewMode === 'farmers' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredFarmers.map((farmer) => (
              <motion.div
                key={farmer._id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFarmerClick(farmer)}
                className="bg-gradient-to-br from-[#1d4b3e] to-[#0f2a24] p-6 rounded-xl border border-emerald-500/30 shadow-lg cursor-pointer hover:border-emerald-500/60 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-emerald-500/20 p-2 rounded-lg mr-3">
                      <Users className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-white font-bold">{farmer.name}</h2>
                      <p className="text-gray-400 text-sm">ID: {farmer._id.substring(0, 10)}...</p>
                    </div>
                  </div>
                  <div className="bg-green-500/20 py-1 px-2 rounded text-green-300 text-sm font-medium flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-1" />
                    Verified
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center bg-emerald-500/10 py-1 px-3 rounded-full">
                    <Package className="w-4 h-4 text-emerald-400 mr-2" />
                    <span className="text-white">{farmer.productCount || 0} Products</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent double triggering with the parent div click
                      handleFarmerClick(farmer);
                    }}
                    className="text-emerald-400 hover:text-emerald-300 flex items-center"
                  >
                    View Products <Eye className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
            
            {filteredFarmers.length === 0 && (
              <div className="col-span-full text-center p-8 bg-[#193d33] rounded-xl border border-emerald-700">
                <Package className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-300 text-lg">No verified farmers found</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Products List View with Pagination */}
        {viewMode === 'products' && selectedFarmer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Farmer Info Card */}
            <div className="bg-gradient-to-br from-[#1d4b3e] to-[#0f2a24] p-6 rounded-xl border border-emerald-500/30 shadow-lg mb-6">
              <div className="flex items-center">
                <div className="bg-emerald-500/20 p-3 rounded-lg mr-4">
                  <Users className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedFarmer.name}</h2>
                  <p className="text-emerald-300">
                    <span className="flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-1" />
                      Verified Farmer
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                Array(3).fill(null).map((_, index) => (
                  <div key={index} className="bg-[#193d33] rounded-xl border border-emerald-700 p-4 animate-pulse">
                    <div className="h-40 w-full bg-emerald-800/40 rounded-lg mb-4"></div>
                    <div className="h-4 bg-emerald-800/40 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-emerald-800/40 rounded w-1/2"></div>
                  </div>
                ))
              ) : farmerProducts.length > 0 ? (
                farmerProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleProductClick(product)}
                    className="bg-gradient-to-br from-[#1d4b3e] to-[#0f2a24] rounded-xl border border-emerald-500/30 shadow-lg overflow-hidden cursor-pointer hover:border-emerald-500/60 transition-all"
                  >
                    {/* Product Image */}
                    <div className="h-40 w-full bg-emerald-800/40 relative flex items-center justify-center">
                      {product.image_url ? (
                        <img 
                          src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${product.image_url}`} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/400x300/1a332e/white?text=Product";
                          }}
                        />
                      ) : (
                        <Package className="w-12 h-12 text-emerald-500/40" />
                      )}
                      
                      {/* Discount Badge */}
                      {product.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-white font-medium text-lg mb-1">{product.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">
                        {product.category} • {product.available_quantity} {product.unit} available
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          {product.discount > 0 ? (
                            <>
                              <span className="line-through text-gray-500">₹{product.price}</span>
                              <span className="text-white font-bold ml-2">
                                ₹{(product.price * (1 - product.discount/100)).toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-white font-bold">₹{product.price}</span>
                          )}
                          <span className="text-gray-400">/{product.unit}</span>
                        </div>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product);
                          }}
                          className="text-emerald-400 hover:text-emerald-300"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center p-8 bg-[#193d33] rounded-xl border border-emerald-700">
                  <Package className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-300 text-lg">No products found for this farmer</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && farmerProducts.length > 0 && !loading && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full ${
                      currentPage === 1 
                        ? 'text-gray-500 cursor-not-allowed' 
                        : 'text-emerald-400 hover:bg-emerald-900/30'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: pagination.pages }, (_, i) => {
                    const pageNum = i + 1;
                    // Show current page, first, last, and 1 page before and after current
                    const shouldShow = 
                      pageNum === 1 || 
                      pageNum === pagination.pages || 
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                    
                    // Show dots for skipped pages
                    if (!shouldShow) {
                      // Only show dots for first skipped section and last skipped section
                      if (pageNum === 2 || pageNum === pagination.pages - 1) {
                        return (
                          <span key={`dots-${pageNum}`} className="px-2 text-gray-500">...</span>
                        );
                      }
                      return null;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full ${
                          currentPage === pageNum
                            ? 'bg-emerald-600 text-white'
                            : 'text-emerald-400 hover:bg-emerald-900/30'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.pages}
                    className={`p-2 rounded-full ${
                      currentPage === pagination.pages
                        ? 'text-gray-500 cursor-not-allowed' 
                        : 'text-emerald-400 hover:bg-emerald-900/30'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
        
        {/* Product Details View */}
        {viewMode === 'product-details' && selectedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#1d4b3e] to-[#0f2a24] rounded-xl border border-emerald-500/30 shadow-lg overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Image */}
              <div className="bg-emerald-800/40 h-64 md:h-full flex items-center justify-center p-4">
                {currentProduct?.image_url ? (
                  <img 
                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${currentProduct.image_url}`}
                    alt={currentProduct.name} 
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                ) : (
                  <Package className="w-24 h-24 text-emerald-500/40" />
                )}
              </div>
              
              {/* Product Details */}
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {currentProduct?.name || selectedProduct.name}
                    </h2>
                    <div className="flex items-center mb-4">
                      <Tag className="w-4 h-4 text-emerald-400 mr-2" />
                      <span className="text-emerald-300">
                        {currentProduct?.category || selectedProduct.category}
                      </span>
                    </div>
                  </div>
{/*                   
                  <div className="flex space-x-2">
                    <button className="p-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button className="p-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div> */}
                </div>
                
                <p className="text-gray-300 mb-6">
                  {currentProduct?.description || selectedProduct.description || "No description available"}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-emerald-800/40 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Price</p>
                    <div>
                      {(currentProduct?.discount || selectedProduct.discount) > 0 ? (
                        <>
                          <span className="line-through text-gray-500">
                            ₹{currentProduct?.price || selectedProduct.price}
                          </span>
                          <span className="text-white font-bold text-xl ml-2">
                            ₹{((currentProduct?.price || selectedProduct.price) * 
                              (1 - (currentProduct?.discount || selectedProduct.discount)/100)).toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-white font-bold text-xl">
                          ₹{currentProduct?.price || selectedProduct.price}
                        </span>
                      )}
                      <span className="text-gray-400">/{currentProduct?.unit || selectedProduct.unit}</span>
                    </div>
                  </div>
                  
                  <div className="bg-emerald-800/40 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Available Quantity</p>
                    <p className="text-white font-bold text-xl">
                      {currentProduct?.available_quantity || selectedProduct.available_quantity} {currentProduct?.unit || selectedProduct.unit}
                    </p>
                  </div>
                  
                  <div className="bg-emerald-800/40 p-4 rounded-lg col-span-2">
                    <p className="text-gray-400 text-sm">Traceability</p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-emerald-400 mr-2" />
                        <span className="text-white">Harvested: {
                          formatDate(currentProduct?.traceability?.harvest_date || selectedProduct.traceability?.harvest_date)
                        }</span>
                      </div>
                      <div className="text-white">
                        Method: {currentProduct?.traceability?.harvest_method || selectedProduct.traceability?.harvest_method || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-emerald-800/40 p-4 rounded-lg mb-6">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-400">Added on</p>
                    <p className="text-white">{
                      formatDate(currentProduct?.createdAt || selectedProduct.createdAt)
                    }</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-gray-400">Last updated</p>
                    <p className="text-white">{
                      formatDate(currentProduct?.updatedAt || selectedProduct.updatedAt)
                    }</p>
                  </div>
                </div>
                
                <button
                  onClick={handleBackToProducts}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Products List
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;