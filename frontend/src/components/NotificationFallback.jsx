import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * FallbackNotification component that provides an alternative way to display notifications
 * in case toast notifications from react-toastify or react-hot-toast aren't working.
 * 
 * This can be used directly for critical messages that must be seen by users.
 */

// Global notification container
let notificationsRoot;
let notificationsList = [];
let setNotificationsState = null;

// Create notification container if it doesn't exist
if (typeof document !== 'undefined' && !notificationsRoot) {
  notificationsRoot = document.createElement('div');
  notificationsRoot.id = 'fallback-notifications-root';
  notificationsRoot.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md';
  document.body.appendChild(notificationsRoot);
}

// Notification type styles
const notificationStyles = {
  success: {
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-500'
  },
  error: {
    icon: <AlertCircle className="h-5 w-5 text-red-500" />,
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-500'
  },
  info: {
    icon: <Info className="h-5 w-5 text-blue-500" />,
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-500'
  },
  warning: {
    icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20', 
    borderColor: 'border-yellow-500'
  }
};

// Individual notification
const Notification = ({ id, type, message, onClose }) => {
  const { icon, bgColor, borderColor } = notificationStyles[type] || notificationStyles.info;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [id, onClose]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`rounded-lg shadow-lg border ${borderColor} ${bgColor} p-4 max-w-full flex`}
    >
      <div className="flex-shrink-0 mr-3">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white"
      >
        <X className="h-5 w-5" />
      </button>
    </motion.div>
  );
};

// Notifications container component
const NotificationsContainer = () => {
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    setNotificationsState = setNotifications;
    return () => {
      setNotificationsState = null;
    };
  }, []);
  
  const handleRemove = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    notificationsList = notificationsList.filter(n => n.id !== id);
  };
  
  return createPortal(
    <AnimatePresence>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={handleRemove}
        />
      ))}
    </AnimatePresence>,
    notificationsRoot
  );
};

// Helper functions to add notifications
const showNotification = (type, message) => {
  const id = Date.now().toString();
  const notification = { id, type, message };
  
  notificationsList.push(notification);
  
  if (setNotificationsState) {
    setNotificationsState([...notificationsList]);
  }
  
  return id;
};

export const showSuccessFallback = (message) => showNotification('success', message);
export const showErrorFallback = (message) => showNotification('error', message);
export const showInfoFallback = (message) => showNotification('info', message);
export const showWarningFallback = (message) => showNotification('warning', message);

// Component to be mounted once in the application
export const FallbackNotificationProvider = () => {
  return <NotificationsContainer />;
};

export default FallbackNotificationProvider; 