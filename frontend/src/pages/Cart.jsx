import { motion } from 'framer-motion';
import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import Button from "../components/ui/Button";
import { 
  Trash2, 
  Plus, 
  Minus, 
  Package, 
  CreditCard, 
  Truck, 
  Shield, 
  ArrowRight,
  ShoppingBag
} from 'lucide-react';

function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Organic Tomatoes',
      price: 4.99,
      quantity: 2,
      image: 'https://placehold.co/300x300/1a332e/white?text=Tomatoes',
      farmer: 'John Smith',
      unit: 'kg'
    },
    {
      id: 2,
      name: 'Fresh Apples',
      price: 3.99,
      quantity: 3,
      image: 'https://placehold.co/300x300/1a332e/white?text=Apples',
      farmer: 'Mary Johnson',
      unit: 'kg'
    },
    {
      id: 3,
      name: 'Free Range Eggs',
      price: 6.99,
      quantity: 1,
      image: 'https://placehold.co/300x300/1a332e/white?text=Eggs',
      farmer: 'Robert Davis',
      unit: 'dozen'
    }
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 5.99;
  const total = subtotal + shipping;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1a332e]">
      <Navbar />
      <div className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block p-3 rounded-full bg-teal-500/10 mb-6"
            >
              <ShoppingBag className="w-8 h-8 text-teal-400" />
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-4">Shopping Cart</h1>
            <p className="text-gray-300">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="bg-[#2d4f47] rounded-2xl p-6 border border-teal-500/20"
                  >
                    <div className="flex gap-6">
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                            <p className="text-gray-400 text-sm">By {item.farmer}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center hover:bg-teal-500/20 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-white font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center hover:bg-teal-500/20 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-gray-400 text-sm">${item.price}/{item.unit}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-[#2d4f47] rounded-2xl p-6 border border-teal-500/20 sticky top-24"
              >
                <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-300">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-teal-500/20 pt-4">
                    <div className="flex justify-between text-white font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Package className="w-5 h-5 text-teal-400" />
                    <span className="text-sm">Free delivery on orders over $50</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Shield className="w-5 h-5 text-teal-400" />
                    <span className="text-sm">Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Truck className="w-5 h-5 text-teal-400" />
                    <span className="text-sm">Fast delivery within 2-3 days</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-teal-500 text-white hover:bg-teal-600 flex items-center justify-center gap-2 py-4"
                >
                  <CreditCard className="w-5 h-5" />
                  Proceed to Payment
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
