import React from "react";
import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import CartSidebar from "./CartSidebar";
import axiosInstance from "../../context/axiosInstance";
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Search, 
  ShoppingCart,
  Loader2,
  AlertCircle,
  Package,
  Leaf,
  Filter
} from 'lucide-react';

const ConsumerShop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('farmCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });

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
    <div className="min-h-screen bg-[#1a332e]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Farm Fresh Products
          </h1>
          <p className="text-emerald-300">
            Browse and shop for fresh, organic produce from our certified farmers
          </p>
        </motion.div>

        {/* Search and Cart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products by name, category, or farmer..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#2d4f47] border border-teal-500/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            onClick={toggleCart}
            className="relative bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {calculateTotalItems()}
              </span>
            )}
          </button>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-[#2d4f47] p-6 rounded-xl border border-teal-500/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-500/10 rounded-lg">
                <Package className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Products</p>
                <p className="text-2xl font-bold text-white">{products.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#2d4f47] p-6 rounded-xl border border-teal-500/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-500/10 rounded-lg">
                <Leaf className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Organic Products</p>
                <p className="text-2xl font-bold text-white">
                  {products.filter(p => p.organic).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#2d4f47] p-6 rounded-xl border border-teal-500/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-500/10 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Cart Items</p>
                <p className="text-2xl font-bold text-white">{calculateTotalItems()}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#2d4f47] p-6 rounded-xl border border-teal-500/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-teal-500/10 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Cart Total</p>
                <p className="text-2xl font-bold text-white">₹{calculateTotalPrice()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Section */}
        <div className="bg-[#2d4f47] rounded-xl border border-teal-500/20 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Available Products</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-500/10 rounded-lg text-teal-400 hover:bg-teal-500/20 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Loader2 className="w-12 h-12 animate-spin mb-4" />
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64 text-red-400 bg-red-400/10 rounded-lg p-4">
              <AlertCircle className="w-6 h-6 mr-2" />
              <span>{error}</span>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Package className="w-16 h-16 mb-4" />
              <p className="text-xl">No products available</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {Array.isArray(products) && products.map((product) => (
                <ProductCard 
                  key={product._id || `product-${Math.random()}`}
                  product={product} 
                  addToCart={addToCart}
                  isInCart={cart.some(item => item._id === product._id)}
                />
              ))}
            </motion.div>
          )}
        </div>

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