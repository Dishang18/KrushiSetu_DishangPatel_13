import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Leaf, IndianRupee, Package, User } from 'lucide-react';

const ProductCard = ({ product, addToCart, isInCart }) => {
  // Safely extract properties with default values to prevent undefined errors
  const {
    name = 'Product Name',
    category = 'Uncategorized',
    description = 'No description available',
    price = 0,
    discount = 0,
    available_quantity = 0,
    unit = 'kg',
    image_url,
    traceability = {}
  } = product || {};

  // Ensure price and discount are valid numbers before calculation
  const safePrice = typeof price === 'number' ? price : parseFloat(price) || 0;
  const safeDiscount = typeof discount === 'number' ? discount : parseFloat(discount) || 0;
  
  // Calculate discounted price safely
  const discountedPrice = safeDiscount > 0 ? 
    safePrice - (safePrice * safeDiscount / 100) : 
    safePrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-[#2d4f47] rounded-xl overflow-hidden border border-teal-500/20 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="relative group">
        <img
          src={image_url || 'https://placehold.co/300x300/1a332e/white?text=Product'}
          alt={name}
          className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a332e]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {safeDiscount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            {safeDiscount}% OFF
          </div>
        )}
        {product.organic && (
          <div className="absolute top-4 left-4 bg-teal-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow-lg">
            <Leaf className="w-4 h-4" />
            <span>Organic</span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-gray-300 text-sm">
              <User className="w-4 h-4" />
              <span>{traceability?.farmer || 'Unknown Farmer'}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-teal-500/10 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-emerald-300 fill-current" />
            <span className="text-white text-sm font-medium">4.5</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-500/10 rounded-lg">
              <Package className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-sm text-gray-300">Available</p>
              <p className="text-white font-medium">{available_quantity > 0 ? `${available_quantity} ${unit} left` : 'Out of stock'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-500/10 rounded-lg">
              <IndianRupee className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-sm text-gray-300">Price</p>
              <p className="text-white font-medium">₹{discountedPrice.toFixed(2)}/{unit}</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => addToCart(product)}
          disabled={available_quantity <= 0}
          className={`w-full py-3 px-4 rounded-lg transition-all duration-300 ${
            available_quantity <= 0
              ? 'bg-[#3d5f57] text-gray-400 cursor-not-allowed'
              : isInCart
              ? 'bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/20'
              : 'bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/20'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            {available_quantity <= 0 ? 'Out of Stock' : isInCart ? 'Add More' : 'Add to Cart'}
          </div>
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;