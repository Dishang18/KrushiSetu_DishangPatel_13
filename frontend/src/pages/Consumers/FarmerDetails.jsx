import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  ArrowLeft,
  MapPin,
  ShoppingCart,
  Plus,
  Minus,
  User,
  AlertCircle,
  Phone,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Navbar from "../../components/Navbar";

function ProductFarmers() {
  const { productId } = useParams();
  const location = useLocation();
  const [farmers, setFarmers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  
  // Get data from navigation state or fetch it
  const productName = location.state?.productName || "Product";
  const productImage = location.state?.productImage || "";
  const initialFarmers = location.state?.farmers || [];
  
  // Fetch farmers data for this product if not provided by state
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        // If we already have farmers data from navigation state, use it
        if (initialFarmers && initialFarmers.length > 0) {
          setFarmers(initialFarmers);
          setIsLoading(false);
          return;
        }
        
        // Otherwise fetch from API
        const response = await axios.get(`http://localhost:5000/api/consumer/products/${productId}/farmers`);
        setFarmers(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching farmers:", err);
        setError(err.message || "Failed to fetch farmers");
        setIsLoading(false);
      }
    };
    
    fetchFarmers();
  }, [productId, initialFarmers]);
  
  // Initialize quantities
  useEffect(() => {
    if (farmers.length > 0) {
      const initialQuantities = {};
      farmers.forEach(farmer => {
        initialQuantities[farmer.id] = 1;
      });
      setQuantities(initialQuantities);
    }
  }, [farmers]);
  
  const handleQuantityChange = (farmerId, newQuantity) => {
    if (newQuantity >= 1) {
      const farmer = farmers.find(f => f.id === farmerId);
      if (farmer && newQuantity > farmer.stock) {
        toast.error(`Only ${farmer.stock} ${farmer.unit} available`);
        return;
      }
      
      setQuantities(prev => ({
        ...prev,
        [farmerId]: newQuantity
      }));
    }
  };
  
  const handleAddToCart = (farmer) => {
    const quantity = quantities[farmer.id] || 1;
    
    // Add to cart logic (without Redux)
    // For demonstration, just show toast
    toast.success(`Added ${quantity} ${farmer.unit} of ${productName} to cart`);
    
    // In a real app, you could use context or local storage
    const cartItem = {
      id: farmer.id,
      name: productName,
      price: farmer.discountedPrice || farmer.price,
      originalPrice: farmer.price,
      discount: farmer.discount || 0,
      quantity,
      farmerId: farmer.farmerId,
      farmerName: farmer.farmerName,
      image_url: productImage,
      unit: farmer.unit,
    };
    
    console.log("Added to cart:", cartItem);
  };
  
  const navigateToFarmer = (farmerId) => {
    window.location.href = `/consumer/farmers/${farmerId}`;
  };

  return (
    <div className="min-h-screen bg-[#1a332e]">
      <Navbar />

      <div className="pt-24 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <Link 
            to="/consumer/shop" 
            className="inline-flex items-center text-teal-400 hover:text-teal-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Marketplace
          </Link>
          
          {/* Header with Product Info */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              {productImage && (
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#243c37] flex-shrink-0">
                  <img 
                    src={productImage} 
                    alt={productName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/100x100/243c37/white?text=Product";
                    }}
                  />
                </div>
              )}
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold text-white mb-1"
                >
                  {productName}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-teal-400"
                >
                  Farmers selling this product
                </motion.p>
              </div>
            </div>
            
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400"
            >
              Compare prices and choose from different farmers. Each farmer may offer different price, 
              quality, and delivery options.
            </motion.p>
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-8 text-teal-400">
              <div className="animate-pulse">Loading farmers...</div>
            </div>
          )}
          
          {/* Error state */}
          {!isLoading && error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="text-red-400 flex-shrink-0" />
              <p className="text-red-300">{error}</p>
            </div>
          )}
          
          {/* Empty state */}
          {!isLoading && !error && farmers.length === 0 && (
            <div className="bg-[#2d4f47] rounded-xl border border-teal-500/20 p-10 text-center">
              <h3 className="text-white text-lg font-medium mb-2">
                No farmers found
              </h3>
              <p className="text-gray-400 mb-6">
                There are currently no farmers selling this product
              </p>
              <Link
                to="/consumer/shop"
                className="inline-flex items-center bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Shop
              </Link>
            </div>
          )}
          
          {/* Farmers list */}
          {!isLoading && !error && farmers.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {farmers.map(farmer => (
                <motion.div
                  key={farmer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#2d4f47] rounded-xl border border-teal-500/20 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-[#1a332e] rounded-lg flex items-center justify-center overflow-hidden">
                          {farmer.profileImage ? (
                            <img 
                              src={farmer.profileImage} 
                              alt={farmer.farmerName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-8 h-8 text-teal-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-white text-xl font-medium">{farmer.farmerName}</h3>
                          <div className="mt-1 text-gray-400 text-sm">
                            Farmer ID: {farmer.farmerId}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {farmer.discount > 0 ? (
                          <div>
                            <span className="line-through text-gray-400">₹{farmer.price}</span>
                            <span className="text-white font-medium text-xl ml-2">₹{farmer.discountedPrice.toFixed(2)}</span>
                            <span className="ml-1 bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs">
                              {farmer.discount}% OFF
                            </span>
                          </div>
                        ) : (
                          <span className="text-white font-medium text-xl">₹{farmer.price}</span>
                        )}
                        <span className="text-gray-400">/{farmer.unit}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-4">
                      {farmer.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-teal-400" />
                          <span>{farmer.location}</span>
                        </div>
                      )}
                      {farmer.phoneNumber && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1 text-teal-400" />
                          <span>{farmer.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full text-sm">
                        In Stock: {farmer.stock} {farmer.unit}
                      </div>
                      {farmer.harvestDate && (
                        <div className="px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full text-sm">
                          Harvested: {farmer.harvestDate}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-4 mt-5">
                      <button 
                        onClick={() => navigateToFarmer(farmer.farmerId)}
                        className="flex-1 bg-teal-500/20 text-teal-400 hover:bg-teal-500 hover:text-white rounded-lg py-2 flex items-center justify-center"
                      >
                        View Farmer Profile
                      </button>
                      
                      <div className="flex gap-2 flex-1">
                        <div className="flex items-center justify-between bg-[#1a332e] rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                farmer.id,
                                (quantities[farmer.id] || 1) - 1
                              )
                            }
                            className="px-3 py-2 text-gray-400 hover:bg-teal-500/20"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-white px-3">
                            {quantities[farmer.id] || 1}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                farmer.id,
                                (quantities[farmer.id] || 1) + 1
                              )
                            }
                            className="px-3 py-2 text-gray-400 hover:bg-teal-500/20"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleAddToCart(farmer)}
                          disabled={farmer.stock <= 0}
                          className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-2
                            ${
                              farmer.stock > 0
                                ? "bg-teal-500 hover:bg-teal-600 text-white"
                                : "bg-gray-600 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {farmer.stock > 0
                            ? "Add to Cart"
                            : "Out of Stock"}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductFarmers;