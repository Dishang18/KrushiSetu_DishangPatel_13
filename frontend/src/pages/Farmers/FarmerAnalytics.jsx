import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement,
  BarElement,
  Title,
  ArcElement,
  Tooltip, 
  Legend 
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function FarmerAnalytics() {
  const navigate = useNavigate();

  // Dummy data for Monthly Sales
  const monthlySalesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Monthly Sales (₹)',
      data: [18500, 22000, 19800, 24500, 28000, 25500, 29000, 32500, 36000, 42000, 39500, 48000],
      fill: false,
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.3
    }]
  };
  
  // Dummy data for Top Products
  const topProductsData = {
    labels: ['Organic Tomatoes', 'Fresh Spinach', 'Alphonso Mangoes', 'Red Onions', 'Green Peas'],
    datasets: [{
      label: 'Units Sold',
      data: [450, 380, 320, 290, 250],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
      borderWidth: 1
    }]
  };
  
  // Dummy data for Product Categories
  const productCategoryData = {
    labels: ['Vegetables', 'Fruits', 'Grains', 'Herbs', 'Dairy'],
    datasets: [{
      label: 'Products by Category',
      data: [42, 28, 15, 10, 5],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 99, 132, 0.6)',
      ],
      borderWidth: 1
    }]
  };

  return (
    <div className="min-h-screen bg-[#1a332e]">
      <Navbar />
      <div className="pt-24 px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex justify-between items-center"
          >
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Farmer Dashboard</h1>
              <p className="text-gray-400">View your sales performance and product analytics</p>
            </div>
            <button
              onClick={() => navigate('/farmer/products')}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Manage Products
            </button>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Monthly Sales Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#2d4f47] p-6 rounded-xl border border-teal-500/20 md:col-span-2"
            >
              <h2 className="text-xl font-bold text-white mb-4">Monthly Sales Overview</h2>
              <div className="bg-[#1a332e] p-4 rounded-lg" style={{ height: '300px' }}>
                <Line data={monthlySalesData} options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        callback: function(value) {
                          return '₹' + value.toLocaleString();
                        }
                      }
                    },
                    x: {
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      labels: {
                        color: 'rgba(255, 255, 255, 0.7)'
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return '₹' + context.raw.toLocaleString();
                        }
                      }
                    }
                  }
                }} />
              </div>
              <div className="mt-4 p-4 bg-teal-500/10 rounded-lg border border-teal-500/20">
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-gray-400">Total Annual Sales</p>
                    <p className="text-2xl font-bold text-white">₹345,800</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Average Monthly</p>
                    <p className="text-2xl font-bold text-white">₹28,817</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Growth</p>
                    <p className="text-2xl font-bold text-teal-400">+24.6%</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Top Products Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#2d4f47] p-6 rounded-xl border border-teal-500/20"
            >
              <h2 className="text-xl font-bold text-white mb-4">Best Selling Products</h2>
              <div className="bg-[#1a332e] p-4 rounded-lg" style={{ height: '300px' }}>
                <Bar data={topProductsData} options={{ 
                  maintainAspectRatio: false,
                  indexAxis: 'y',
                  scales: {
                    x: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                      }
                    },
                    y: {
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                      },
                      ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }} />
              </div>
            </motion.div>
            
            {/* Product Categories Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#2d4f47] p-6 rounded-xl border border-teal-500/20"
            >
              <h2 className="text-xl font-bold text-white mb-4">Products by Category</h2>
              <div className="bg-[#1a332e] p-4 rounded-lg" style={{ height: '300px' }}>
                <Doughnut data={productCategoryData} options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        padding: 20,
                        font: {
                          size: 12
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = Math.round((value / total) * 100);
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  }
                }} />
              </div>
            </motion.div>
            
            {/* Quick Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#2d4f47] p-6 rounded-xl border border-teal-500/20 md:col-span-2"
            >
              <h2 className="text-xl font-bold text-white mb-4">Quick Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#1a332e] p-4 rounded-lg border border-teal-500/20">
                  <p className="text-gray-400 text-sm">Active Products</p>
                  <p className="text-2xl font-bold text-white">78</p>
                  <p className="text-teal-400 text-sm mt-1">+12 this month</p>
                </div>
                <div className="bg-[#1a332e] p-4 rounded-lg border border-teal-500/20">
                  <p className="text-gray-400 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-white">1,342</p>
                  <p className="text-teal-400 text-sm mt-1">+89 this month</p>
                </div>
                <div className="bg-[#1a332e] p-4 rounded-lg border border-teal-500/20">
                  <p className="text-gray-400 text-sm">Avg. Order Value</p>
                  <p className="text-2xl font-bold text-white">₹845</p>
                  <p className="text-teal-400 text-sm mt-1">+₹42 vs last month</p>
                </div>
                <div className="bg-[#1a332e] p-4 rounded-lg border border-teal-500/20">
                  <p className="text-gray-400 text-sm">Rating</p>
                  <p className="text-2xl font-bold text-white">4.8/5</p>
                  <p className="text-teal-400 text-sm mt-1">Based on 256 reviews</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerAnalytics;