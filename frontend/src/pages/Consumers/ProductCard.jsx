import React from 'react';

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
    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700 border-opacity-50">
      <div className="relative h-48 overflow-hidden">
        {image_url ? (
          <img 
            src={image_url} 
            alt={name} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
            onError={(e) => {
              e.target.src = "https://placehold.co/400x300/1a332e/white?text=Product";
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-800 to-green-600 flex items-center justify-center">
            <span className="text-white text-xl font-medium">{name}</span>
          </div>
        )}
        
        {safeDiscount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            {safeDiscount}% OFF
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1">
          {category}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold text-green-100 mb-1">{name}</h3>
        
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            {safeDiscount > 0 ? (
              <div className="flex items-center">
                <span className="text-green-400 font-bold text-lg mr-2">₹{discountedPrice.toFixed(2)}</span>
                <span className="text-gray-400 line-through text-sm">₹{safePrice.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-green-400 font-bold text-lg">₹{safePrice.toFixed(2)}</span>
            )}
            <span className="text-gray-400 text-sm ml-1">/{unit}</span>
          </div>
          <div className="text-yellow-400 text-sm">
            {available_quantity > 0 ? `${available_quantity} ${unit} left` : 'Out of stock'}
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{description}</p>
        
        {traceability?.harvest_date && (
          <div className="text-xs text-gray-400 mb-3">
            <span className="font-medium">Harvested:</span> {new Date(traceability.harvest_date).toLocaleDateString()} 
            {traceability.harvest_method && `(${traceability.harvest_method})`}
          </div>
        )}

        <button 
          onClick={() => addToCart(product)}
          disabled={available_quantity <= 0}
          className={`w-full py-2 px-4 rounded-lg transition-colors ${
            available_quantity <= 0
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : isInCart
              ? 'bg-green-700 hover:bg-green-800 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {available_quantity <= 0 ? 'Out of Stock' : isInCart ? 'Add More' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;