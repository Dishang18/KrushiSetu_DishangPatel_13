import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, MapPin, Phone, Mail, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from "../../hooks/useAuth";

function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [deliveryDetails, setDeliveryDetails] = useState({
    address: '',
    mobile: '',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // setUserData(user);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    // if (!storedUser) {
    //   navigate('/login');
    //   return;
    // }
    const user = JSON.parse(storedUser);
    setUserData(user);
    // Pre-fill delivery details with user data
    setDeliveryDetails({
      address: user?.address || '',
      mobile: user?.mobile || '',
      email: user?.email || ''
    });
  }, [navigate]);

  useEffect(() => {
    // Get cart items from localStorage
    const storedCart = localStorage.getItem('farmCart');
    console.log('Stored cart:', storedCart);
    if (!storedCart) {
      navigate('/consumer/cart');
      return;
    }
    setCartItems(JSON.parse(storedCart));
    setLoading(false);
  }, [navigate]);

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.price - (item.price/item.discount)) * item.quantity,
    0
  );
  

  // Handle delivery details change
  const handleDeliveryDetailsChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  // Initialize Razorpay payment
  const initializeRazorpayPayment = async () => {
    try {
      // Create order on your backend
      const response = await fetch('http://localhost:5000/api/orders/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalPrice * 100, // Convert to paise
          currency: 'INR'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create Razorpay order');
      }

      const data = await response.json();
      console.log('Razorpay order data:', data);            
      return data.orderId;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    try {
      const orderId = await initializeRazorpayPayment();

      const options = {
        key: 'rzp_test_3ZarsC2SklRuTX', // Replace with your Razorpay test key
        amount: totalPrice * 100,
        currency: 'INR',
        name: 'Farm Fresh',
        description: 'Purchase KrushiSetu',
        order_id: orderId,
        handler: async (response) => {
          try {
            // Verify payment on your backend
            const verifyResponse = await fetch('http://localhost:5000/api/orders/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            // Create order in your database
            await createOrder('razorpay');
          } catch (error) {
            console.error('Error verifying payment:', error);
            navigator
            // alert('Payment verification failed');
          }
        },
        prefill: {
          name: userData?.name,
          email: deliveryDetails?.email,
          contact: deliveryDetails?.mobile,
        },
        theme: {
          color: '#10B981', // Green color matching your theme
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error initializing Razorpay:', error);
      alert('Failed to initialize payment');
    }
  };

  // Create order in database
  const createOrder = async () => {
    console.log("Creating order with user data:", user);
    console.log("Sending order data:", orderData);

    // Validate items before sending request
    if (!orderData.items || orderData.items.length === 0) {
        console.error("Error: No items in the order.");
        return;
    }

    // Check each item for required properties
    const invalidItems = orderData.items.filter(item => 
        !item.product_id || !item.name || !item.price || !item.quantity
    );

    if (invalidItems.length > 0) {
        console.error("Error: Some items are missing required properties", invalidItems);
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/orders/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Order creation failed");
        }

        console.log("Order created successfully:", data);
    } catch (error) {
        console.error("Error creating order:", error);
    }
};




  // Handle place order
  const handlePlaceOrder = async () => {
    try {
      // Validate delivery details
      if (!deliveryDetails.address || !deliveryDetails.mobile || !deliveryDetails.email) {
        alert('Please fill in all delivery details');
        return;
      }

      if (paymentMethod === 'cod') {
        // Handle Cash on Delivery
        await createOrder('cod');
      } else {
        // Handle Razorpay payment
        await handleRazorpayPayment();
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c1816] to-[#0b1f1a]">
        <Navbar />
        <div className="pt-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c1816] to-[#0b1f1a]">
        <Navbar />
        <div className="pt-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center text-red-500">
              <p>Error: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c1816] to-[#0b1f1a]">
      <Navbar />
      
      {/* Main Content */}
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block p-3 rounded-full bg-teal-500/10 mb-6"
            >
              <Package className="w-8 h-8 text-green-600 dark:text-teal-400" />
            </motion.div>
            <h1 className="font-serif text-4xl font-bold tracking-tighter text-green-900 dark:text-teal-50 mb-4">
              Checkout
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Review your order and complete your purchase
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Delivery Details */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-green-200/20 dark:border-teal-800/20 p-6 mb-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-teal-50 mb-6">
                  Delivery Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Delivery Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <textarea
                        name="address"
                        value={deliveryDetails.address}
                        onChange={handleDeliveryDetailsChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-green-200/20 dark:border-teal-800/20 text-gray-900 dark:text-teal-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-teal-500"
                        rows="3"
                        placeholder="Enter your delivery address"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="mobile"
                        value={deliveryDetails.mobile}
                        onChange={handleDeliveryDetailsChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-green-200/20 dark:border-teal-800/20 text-gray-900 dark:text-teal-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-teal-500"
                        placeholder="Enter your mobile number"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={deliveryDetails.email}
                        onChange={handleDeliveryDetailsChange}
                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-green-200/20 dark:border-teal-800/20 text-gray-900 dark:text-teal-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-teal-500"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-green-200/20 dark:border-teal-800/20 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-teal-50 mb-6">
                  Payment Method
                </h2>
                <div className="space-y-4">
                  <label className="flex items-center p-4 rounded-lg border border-green-200/20 dark:border-teal-800/20 cursor-pointer hover:bg-white/5">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => handlePaymentMethodChange('cod')}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <Wallet className="w-6 h-6 text-green-600 dark:text-teal-400 mr-3" />
                      <span className="text-gray-900 dark:text-teal-50">Cash on Delivery</span>
                    </div>
                  </label>
                  <label className="flex items-center p-4 rounded-lg border border-green-200/20 dark:border-teal-800/20 cursor-pointer hover:bg-white/5">
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={() => handlePaymentMethodChange('razorpay')}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      <CreditCard className="w-6 h-6 text-green-600 dark:text-teal-400 mr-3" />
                      <span className="text-gray-900 dark:text-teal-50">Razorpay</span>
                    </div>
                  </label>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-green-200/20 dark:border-teal-800/20 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-teal-50 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-900 dark:text-teal-50">{item.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <span className="text-gray-900 dark:text-teal-50">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-green-200/20 dark:border-teal-800/20 pt-4">
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Subtotal</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-teal-50 mt-2">
                      <span>Total</span>
                      <span>₹{totalPrice}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePlaceOrder}
                    className="w-full bg-green-600 dark:bg-teal-500 text-white py-3 rounded-lg hover:bg-green-700 dark:hover:bg-teal-600 transition-colors"
                  >
                    Place Order
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
