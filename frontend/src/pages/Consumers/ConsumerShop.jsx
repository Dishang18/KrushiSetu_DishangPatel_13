import React from "react";
import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import CartSidebar from "./CartSidebar";
import axiosInstance from "../../context/axiosInstance";
import { useNavigate } from "react-router-dom";

const ConsumerShop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('farmCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });

  // Function to handle redirection to PredictionTester
  const handleAskAI = () => {
    navigate("/consumer/prediction-tester");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/products");
        console.log("API Response:", response.data);
        
        let processedProducts = [];
        
        // Process the API response to ensure we have valid data structure
        if (response.data && Array.isArray(response.data)) {
          processedProducts = response.data;
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          processedProducts = response.data.data;
        } else if (response.data && response.data.products && Array.isArray(response.data.products)) {
          processedProducts = response.data.products;
        } else if (response.data && typeof response.data === 'object') {
          processedProducts = Object.values(response.data);
        }
        
        // Ensure each product has an _id or generate a fallback unique ID
        const productsWithIds = processedProducts.map((product, index) => {
          if (!product._id) {
            return { ...product, _id: `temp-id-${index}` };
          }
          return product;
        });
        
        setProducts(productsWithIds);
        setLoading(false);
      } catch (error) {
        console.error("API Error:", error);
        setError("Failed to load products. Please try again later.");
        setProducts([]);
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      
      if (existingItem) {
        // If item already in cart, increase quantity (up to available amount)
        return prevCart.map((item) => 
          item._id === product._id && item.quantity < product.available_quantity 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    
    // Automatically open cart when adding first item
    if (cart.length === 0) {
      setIsCartOpen(true);
    }
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const calculateTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.price;
      const discountedPrice = price - (price * item.discount / 100);
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f1a] via-[#0a2018] to-[#0c2a22]">
      <Navbar />

      <div className="container mx-auto pt-24 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-100">Farm Fresh Products</h1>
          
          <div className="flex items-center space-x-4">
            {/* Ask AI Button */}
            <button 
              onClick={handleAskAI}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m0 16v1m-9-9h1m16 0h1m-2.947-7.053l-.708.708M5.657 7.657l-.708-.708m0 9.9l.708-.708M18.343 17.55l.708.708" />
              </svg>
              <span>Ask AI</span>
            </button>
            
            {/* Cart Button */}
            <button 
              onClick={toggleCart}
              className="relative bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {calculateTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-300">No products available at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.isArray(products) && products.map((product) => {
              // Ensure each product has a unique key
              const uniqueKey = product._id || `product-${product.name}-${Math.random().toString(36).substr(2, 9)}`;
              
              return (
                <ProductCard 
                  key={uniqueKey} 
                  product={product} 
                  addToCart={addToCart}
                  isInCart={cart.some(item => item._id === product._id)}
                />
              );
            })}
          </div>
        )}

        {/* Cart Sidebar */}
        <CartSidebar
          isOpen={isCartOpen}
          onClose={toggleCart}
          cart={cart}
          updateQuantity={updateCartItemQuantity}
          removeItem={removeFromCart}
          totalPrice={calculateTotalPrice()}
        />
      </div>
    </div>
  );
};

export default ConsumerShop;