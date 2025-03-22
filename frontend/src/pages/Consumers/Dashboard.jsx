import React, { useState } from "react";
import Navbar from "./Navbar";
import { 
  ShoppingCart, 
  Wallet, 
  Package, 
  Heart, 
  Clock, 
  CheckCircle, 
  Truck,
  Calendar,
  ShoppingBag,
  Bell,
  ArrowRight,
  Leaf,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";

const ConsumerDashboard = () => {
  const [activeTab, setActiveTab] = useState("Recent Orders");
  
  // Use the updated current date/time from your provided information
  const currentDateTime = new Date().toLocaleString();

  const username = "Dishang18";

  const orders = [
    { id: 38291, date: "2025-03-15", items: "Organic Tomatoes, Farm Fresh Spinach", total: "₹1,298", status: "Delivered", farmName: "Patel Organic Farms" },
    { id: 38276, date: "2025-03-10", items: "Natural Honey, Organic Eggs, Rice", total: "₹899", status: "In Transit", farmName: "Green Valley Produce" },
    { id: 38254, date: "2025-03-05", items: "Wheat Flour, Jaggery, Pulses", total: "₹1,545", status: "Processing", farmName: "Sunshine Organics" }
  ];

  const recommendedProducts = [
    { id: 1, name: "Organic Rice", price: "₹120/kg", farm: "Krishna Farms", image: "🌾" },
    { id: 2, name: "Fresh Vegetables Basket", price: "₹350", farm: "Green Valley", image: "🥬" },
    { id: 3, name: "Organic Honey", price: "₹280/500g", farm: "Bee Natural", image: "🍯" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Component */}
      <Navbar />

      {/* Main Content - with padding for fixed navbar */}
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Welcome Section with Date/Time */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-4">
          <div className="flex justify-between items-center flex-wrap">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome back, {username}!</h2>
              <p className="text-gray-600 mt-1">What would you like to order today?</p>
            </div>
            <div className="flex items-center text-gray-500 mt-2 sm:mt-0 bg-gray-50 px-3 py-2 rounded-lg">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              <span>{currentDateTime}</span>
            </div>
          </div>
        </div>

        {/* Stats Section - Improved with better styling */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                <h3 className="text-2xl font-bold text-gray-800">12</h3>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-amber-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm font-medium">Pending</p>
                <h3 className="text-2xl font-bold text-gray-800">2</h3>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-lg">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm font-medium">Saved Farms</p>
                <h3 className="text-2xl font-bold text-gray-800">8</h3>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm font-medium">Total Spent</p>
                <h3 className="text-2xl font-bold text-gray-800">₹15,490</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* Fix: Only use Link, don't nest button inside Link */}
            <Link to="/consumer/shop" className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:bg-green-50 hover:shadow-md transition-all text-center border border-gray-100">
              <ShoppingBag className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-gray-700 font-medium">Shop Now</span>
            </Link>
            
            <Link to="/consumer/orders" className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:bg-green-50 hover:shadow-md transition-all text-center border border-gray-100">
              <Package className="w-8 h-8 text-indigo-600 mb-2" />
              <span className="text-gray-700 font-medium">Track Orders</span>
            </Link>
            
            <Link to="/consumer/wishlist" className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:bg-green-50 hover:shadow-md transition-all text-center border border-gray-100">
              <Heart className="w-8 h-8 text-red-500 mb-2" />
              <span className="text-gray-700 font-medium">Wishlist</span>
            </Link>
            
            <Link to="/consumer/notifications" className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:bg-green-50 hover:shadow-md transition-all text-center border border-gray-100">
              <Bell className="w-8 h-8 text-amber-500 mb-2" />
              <span className="text-gray-700 font-medium">Notifications</span>
            </Link>
          </div>
        </div>

        {/* Tabs with improved styling */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex space-x-6 border-b">
            {["Recent Orders", "Saved Farms", "Notifications"].map((tab) => (
              <button
                key={tab}
                className={`pb-3 px-2 font-medium ${
                  activeTab === tab 
                    ? "border-b-2 border-green-600 text-green-600" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Orders List with improved UI */}
          {activeTab === "Recent Orders" && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Your Recent Orders</h3>
                <Link to="/consumer/orders" className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
                  View All <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div className="mb-3 md:mb-0">
                        <div className="flex items-center">
                          <span className="text-gray-900 font-bold">Order #{order.id}</span>
                          <span className="mx-2 text-gray-300">|</span>
                          <span className="text-gray-500 text-sm">{order.date}</span>
                        </div>
                        <div className="mt-1">
                          <p className="text-gray-700">{order.items}</p>
                          <p className="text-gray-500 text-sm mt-1">From: {order.farmName}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between md:justify-end items-center">
                        <div className="text-gray-900 font-bold mr-4">{order.total}</div>
                        <div className={`flex items-center px-3 py-1 rounded-full ${
                          order.status === "Delivered" 
                            ? "bg-green-100 text-green-800" 
                            : order.status === "In Transit" 
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {order.status === "Delivered" ? (
                            <CheckCircle className="w-4 h-4 mr-1" />
                          ) : order.status === "In Transit" ? (
                            <Truck className="w-4 h-4 mr-1" />
                          ) : (
                            <Clock className="w-4 h-4 mr-1" />
                          )}
                          <span className="text-sm font-medium">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Saved Farms Tab Content */}
          {activeTab === "Saved Farms" && (
            <div className="mt-4">
              <p className="text-gray-500">Your saved farms will appear here.</p>
            </div>
          )}
          
          {/* Notifications Tab Content */}
          {activeTab === "Notifications" && (
            <div className="mt-4">
              <p className="text-gray-500">Your notifications will appear here.</p>
            </div>
          )}
        </div>
        
        {/* Recommended Products */}
        <div className="mt-8 mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recommended For You</h3>
            <Link to="/consumer/shop" className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-32 bg-gray-50 flex items-center justify-center text-4xl">
                  {product.image}
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900">{product.name}</h4>
                  <p className="text-gray-500 text-sm">{product.farm}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="font-bold text-gray-900">{product.price}</span>
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsumerDashboard;