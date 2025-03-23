import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import { Line, Bar, Pie } from 'react-chartjs-2';
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

function ConsumerAnalytics() {
  const navigate = useNavigate();

  // Dummy data for Purchase History
  const purchaseHistoryData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [{
      label: 'Monthly Spending (₹)',
      data: [3200, 2800, 3500, 4200, 3900, 4500],
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      tension: 0.3
    }]
  };
  
  // Dummy data for Product Categories
  const categoryDistData = {
    labels: ['Vegetables', 'Fruits', 'Dairy', 'Grains', 'Herbs'],
    datasets: [{
      data: [45, 25, 15, 10, 5],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
      borderWidth: 1
    }]
  };
  
  // Dummy data for Frequently Purchased
  const frequentItemsData = {
    labels: ['Tomatoes', 'Potatoes', 'Milk', 'Spinach', 'Onions'],
    datasets: [{
      label: 'Purchase Frequency',
      data: [12, 9, 8, 7, 6],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
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
              <h1 className="text-4xl font-bold text-white mb-2">Shopping Insights</h1>
              <p className="text-gray-400">Track your purchase patterns and preferences</p>
            </div>
            <button
              onClick={() => navigate('/shop')}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Go Shopping
            </button>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Spending History Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#2d4f47] p-6 rounded-xl border border-teal-500/20 md:col-span-2"
            >
              <h2 className="text-xl font-bold text-white mb-4">Your Purchase History</h2>
              <div className="bg-[#1a332e] p-4 rounded-lg" style={{ height: '300px' }}>
                <Line data={purchaseHistoryData} options={{ 
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
                          return '₹' + value;
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
                    }
                  }
                }} />
              </div>
              <div className="mt-4 p-4 bg-teal-500/10 rounded-lg border border-teal-500/20">
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-gray-400">Total Spent</p>
                    <p className="text-2xl font-bold text-white">₹22,100</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Average Monthly</p>
                    <p className="text-2xl font-bold text-white">₹3,683</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Estimated Savings</p>
                    <p className="text-2xl font-bold text-teal-400">₹4,420</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Shopping Preferences Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#2d4f47] p-6 rounded-xl border border-teal-500/20"
            >
              <h2 className="text-xl font-bold text-white mb-4">Shopping Preferences</h2>
              <div className="bg-[#1a332e] p-4 rounded-lg" style={{ height: '300px' }}>
                <Pie data={categoryDistData} options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: 'rgba(255, 255, 255, 0.7)'
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = Math.round((value / total) * 100);
                          return `${label}: ${percentage}%`;
                        }
                      }
                    }
                  }
                }} />
              </div>
            </motion.div>
            
            {/* Frequently Purchased Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#2d4f47] p-6 rounded-xl border border-teal-500/20"
            >
              <h2 className="text-xl font-bold text-white mb-4">Frequently Purchased Items</h2>
              <div className="bg-[#1a332e] p-4 rounded-lg" style={{ height: '300px' }}>
                <Bar data={frequentItemsData} options={{ 
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
            
            {/* Shopping Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#2d4f47] p-6 rounded-xl border border-teal-500/20 md:col-span-2"
            >
              <h2 className="text-xl font-bold text-white mb-4">Shopping Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#1a332e] p-4 rounded-lg border border-teal-500/20">
                  <p className="text-gray-400 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-white">24</p>
                  <p className="text-teal-400 text-sm mt-1">5 orders this month</p>
                </div>
                <div className="bg-[#1a332e] p-4 rounded-lg border border-teal-500/20">
                  <p className="text-gray-400 text-sm">Avg. Order Value</p>
                  <p className="text-2xl font-bold text-white">₹920</p>
                  <p className="text-teal-400 text-sm mt-1">+₹65 from last month</p>
                </div>
                <div className="bg-[#1a332e] p-4 rounded-lg border border-teal-500/20">
                  <p className="text-gray-400 text-sm">Favorite Farmer</p>
                  <p className="text-2xl font-bold text-white">Raman Patel</p>
                  <p className="text-teal-400 text-sm mt-1">8 orders from this farmer</p>
                </div>
                <div className="bg-[#1a332e] p-4 rounded-lg border border-teal-500/20">
                  <p className="text-gray-400 text-sm">Seasonal Preference</p>
                  <p className="text-2xl font-bold text-white">Summer</p>
                  <p className="text-teal-400 text-sm mt-1">46% of purchases</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsumerAnalytics;