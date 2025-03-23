import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose, cart, updateQuantity, removeItem, totalPrice }) => {
  // Store cart in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('farmCart', JSON.stringify(cart));
  }, [cart]);

  const navigate = useNavigate();
  if (!isOpen) return null;

  // Function to handle checkout process
  const handleCheckout = () => {
    // Add checkout logic here
    navigate('/consumer/checkout');
  };

  // Animation classes for cart panel
  const sidebarClasses = `transform transition-transform duration-300 ease-in-out 
                         ${isOpen ? 'translate-x-0' : 'translate-x-full'}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" onClick={onClose}>
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
        {/* Overlay */}
      </div>
      
      <div 
        className="absolute inset-y-0 right-0 max-w-md w-full pointer-events-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className={`${sidebarClasses} h-full`}>
          <div className="flex flex-col h-full bg-gradient-to-b from-[#0a2820] via-[#0a1f1a] to-[#072218] shadow-2xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-green-900/50 bg-green-900/20">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-green-50 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Your Cart
                </h2>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-green-800/30 text-gray-300 hover:text-white transition-all duration-200"
                  aria-label="Close cart"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-80 text-gray-400">
                  <div className="bg-green-800/20 p-6 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-300/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-xl font-medium text-gray-300">Your cart is empty</p>
                  <p className="text-sm text-gray-500 mt-2 mb-6">Looks like you haven't added any products yet</p>
                  <button 
                    onClick={onClose}
                    className="mt-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 px-6 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-green-700/30 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div>
                  <div className="space-y-4 mb-8">
                    {cart.map((item) => {
                      const discountedPrice = item.price - (item.price * item.discount / 100);
                      const itemTotal = discountedPrice * item.quantity;
                      
                      return (
                        <div 
                          key={item._id} 
                          className="bg-white/5 hover:bg-white/10 border border-green-900/30 rounded-lg p-4 flex transition-all duration-200 group"
                        >
                          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-700">
                            {item.image_url ? (
                              <img 
                                src={item.image_url} 
                                alt={item.name} 
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-green-800 to-green-900 flex items-center justify-center">
                                <span className="text-white text-sm font-medium">{item.name.substring(0, 1)}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <h4 className="text-green-50 font-medium text-base">{item.name}</h4>
                              <button 
                                onClick={() => removeItem(item._id)}
                                className="text-gray-500 hover:text-red-400 transition-colors duration-200 p-1 hover:bg-red-900/20 rounded-full"
                                aria-label="Remove item"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                            
                            <div className="flex items-center text-gray-400 text-sm mb-3 mt-1">
                              <span className="text-green-400">₹{discountedPrice.toFixed(2)}</span>
                              <span className="mx-1 text-gray-600">/</span>
                              <span>{item.unit}</span>
                              {item.discount > 0 && (
                                <span className="ml-2 bg-red-900/30 text-red-300 text-xs px-1.5 py-0.5 rounded">
                                  {item.discount}% OFF
                                </span>
                              )}
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <div className="flex items-center bg-green-900/20 border border-green-900/30 rounded-md overflow-hidden">
                                <button 
                                  onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                                  className="px-3 py-1 text-gray-300 hover:text-white hover:bg-green-700/30 transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  −
                                </button>
                                <span className="px-3 py-1 text-white bg-green-900/30 min-w-[32px] text-center">
                                  {item.quantity}
                                </span>
                                <button 
                                  onClick={() => updateQuantity(item._id, Math.min(item.available_quantity, item.quantity + 1))}
                                  className={`px-3 py-1 transition-colors ${
                                    item.quantity >= item.available_quantity 
                                      ? 'text-gray-600 cursor-not-allowed' 
                                      : 'text-gray-300 hover:text-white hover:bg-green-700/30'
                                  }`}
                                  disabled={item.quantity >= item.available_quantity}
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>
                              
                              <div className="text-green-300 font-medium">
                                ₹{itemTotal.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-green-900/50 p-6 bg-green-900/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-300">Items:</span>
                  <span className="text-gray-300">{cart.reduce((total, item) => total + item.quantity, 0)}</span>
                </div>
                
                <div className="flex justify-between text-lg font-bold text-green-50 mb-6">
                  <span>Total Amount:</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3.5 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-green-700/30 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  Proceed to Checkout
                </button>
                
                <button 
                  onClick={onClose}
                  className="w-full mt-3 bg-transparent hover:bg-green-900/30 text-green-300 py-2.5 border border-green-700/40 hover:border-green-700/80 rounded-lg font-medium transition-all duration-200"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};



export default CartSidebar;