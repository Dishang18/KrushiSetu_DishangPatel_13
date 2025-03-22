import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import { 
  User, 
  Bell, 
  Settings, 
  Edit, 
  MapPin, 
  Calendar,
  LogOut,
  Check,
  Pencil
} from 'lucide-react';

function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Order Delivered',
      message: 'Your order #ORD-001 has been delivered successfully.',
      time: '2 hours ago',
      type: 'order'
    },
    {
      id: 2,
      title: 'Verification Update',
      message: 'Your farm verification is in progress. We\'ll notify you once it\'s complete.',
      time: '1 day ago',
      type: 'verification'
    },
    {
      id: 3,
      title: 'New Product Available',
      message: 'Green Valley Farm has added new seasonal products to their store.',
      time: '3 days ago',
      type: 'product'
    }
  ]);

  const [preferences, setPreferences] = useState({
    organic: true,
    local: true,
    seasonal: true
  });

  const [favoriteCategories, setFavoriteCategories] = useState([
    'Vegetables',
    'Fruits',
    'Dairy'
  ]);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    publicProfile: true,
    showLocation: true
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#1a332e]">
      <Navbar />
      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-3">
            <div className="bg-[#2d4f47] rounded-xl overflow-hidden">
              {/* Cover Image */}
              <div className="h-32 bg-gradient-to-r from-teal-500 to-blue-500 relative">
                <button className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              
              {/* Profile Info */}
              <div className="px-6 pb-6">
                <div className="relative -mt-16 mb-4">
                  <div className="w-32 h-32 rounded-full bg-[#1a332e] border-4 border-[#2d4f47] mx-auto overflow-hidden">
                    <img
                      src="https://placehold.co/200x200/1a332e/white?text=JS"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-1">John Smith</h2>
                  <p className="text-gray-400 mb-2">john.smith@example.com</p>
                  <div className="flex items-center justify-center text-gray-400 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full text-sm">
                      Farmer
                    </span>
                    <span className="px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full text-sm">
                      Member since March 2023
                    </span>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="mt-8 space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-teal-500 text-white'
                            : 'text-gray-400 hover:bg-teal-500/10 hover:text-teal-400'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {tab.label}
                      </button>
                    );
                  })}
                  <button className="w-full flex items-center px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-9">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#2d4f47] rounded-xl p-6 border border-teal-500/20"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                  <button className="flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors">
                    <Pencil className="w-5 h-5" />
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 mb-2">Full Name</label>
                    <p className="text-white">John Smith</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Email</label>
                    <p className="text-white">john.smith@example.com</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Location</label>
                    <p className="text-white">San Francisco, CA</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Member Since</label>
                    <p className="text-white">March 2023</p>
                  </div>
                </div>

                <div className="mt-8">
                  <label className="block text-gray-400 mb-2">Bio</label>
                  <p className="text-white">
                    Passionate about sustainable agriculture and supporting local farmers. 
                    I believe in the importance of knowing where our food comes from.
                  </p>
                </div>

                <div className="mt-8">
                  <h3 className="text-white font-bold mb-4">Preferences</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(preferences).map(([key, value]) => (
                      value && (
                        <span key={key} className="px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full text-sm capitalize">
                          {key}
                        </span>
                      )
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-white font-bold mb-4">Favorite Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {favoriteCategories.map((category) => (
                      <span key={category} className="px-3 py-1 bg-teal-500/10 text-teal-400 rounded-full text-sm">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-[#2d4f47] rounded-xl p-6 border border-teal-500/20">
                  <h2 className="text-2xl font-bold text-white mb-2">Notifications</h2>
                  <p className="text-gray-400">Manage your notifications and preferences</p>

                  <div className="mt-8 space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 rounded-lg bg-[#1a332e] border border-teal-500/20"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-full bg-teal-500/10">
                            <Bell className="w-5 h-5 text-teal-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-medium mb-1">{notification.title}</h3>
                            <p className="text-gray-400 text-sm">{notification.message}</p>
                            <p className="text-gray-500 text-sm mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#2d4f47] rounded-xl p-6 border border-teal-500/20">
                  <h3 className="text-xl font-bold text-white mb-6">Notification Preferences</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-300">Email notifications</span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={() => setSettings(prev => ({
                            ...prev,
                            emailNotifications: !prev.emailNotifications
                          }))}
                          className="sr-only"
                        />
                        <div className={`w-10 h-6 rounded-full transition-colors ${
                          settings.emailNotifications ? 'bg-teal-500' : 'bg-gray-600'
                        }`}>
                          <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                            settings.emailNotifications ? 'translate-x-5' : 'translate-x-1'
                          } mt-1`} />
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-[#2d4f47] rounded-xl p-6 border border-teal-500/20">
                  <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-bold mb-4">Password</h3>
                      <button className="px-4 py-2 bg-teal-500/10 text-teal-400 rounded-lg hover:bg-teal-500/20 transition-colors">
                        Change Password
                      </button>
                    </div>

                    <div>
                      <h3 className="text-white font-bold mb-4">Privacy Settings</h3>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-gray-300">Public profile visibility</span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={settings.publicProfile}
                              onChange={() => setSettings(prev => ({
                                ...prev,
                                publicProfile: !prev.publicProfile
                              }))}
                              className="sr-only"
                            />
                            <div className={`w-10 h-6 rounded-full transition-colors ${
                              settings.publicProfile ? 'bg-teal-500' : 'bg-gray-600'
                            }`}>
                              <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                                settings.publicProfile ? 'translate-x-5' : 'translate-x-1'
                              } mt-1`} />
                            </div>
                          </div>
                        </label>

                        <label className="flex items-center justify-between cursor-pointer">
                          <span className="text-gray-300">Show my location</span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={settings.showLocation}
                              onChange={() => setSettings(prev => ({
                                ...prev,
                                showLocation: !prev.showLocation
                              }))}
                              className="sr-only"
                            />
                            <div className={`w-10 h-6 rounded-full transition-colors ${
                              settings.showLocation ? 'bg-teal-500' : 'bg-gray-600'
                            }`}>
                              <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                                settings.showLocation ? 'translate-x-5' : 'translate-x-1'
                              } mt-1`} />
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white font-bold mb-4">Delete Account</h3>
                      <p className="text-gray-400 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
