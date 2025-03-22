import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const typeStyles = {
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/50',
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    title: 'Success'
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/50',
    icon: <AlertCircle className="h-5 w-5 text-red-500" />,
    title: 'Error'
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/50',
    icon: <Info className="h-5 w-5 text-blue-500" />,
    title: 'Information'
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/50',
    icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    title: 'Warning'
  }
};

const AlertMessage = ({ type = 'info', message, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);
  const style = typeStyles[type] || typeStyles.info;
  
  useEffect(() => {
    if (duration !== null) {
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Call onClose after animation completes
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300); // Call onClose after animation completes
  };
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`rounded-lg p-4 mb-4 ${style.bg} border ${style.border} shadow-lg`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              {style.icon}
            </div>
            <div className="flex-grow">
              <h3 className="text-sm font-medium text-white">{style.title}</h3>
              <div className="mt-1 text-sm text-gray-300">
                {message}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="ml-auto flex-shrink-0 flex p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Component to manage multiple alerts
export const AlertContainer = ({ alerts, removeAlert }) => {
  if (!alerts || alerts.length === 0) return null;
  
  return (
    <div className="fixed top-20 right-4 z-50 w-80 space-y-2">
      {alerts.map((alert) => (
        <AlertMessage
          key={alert.id}
          type={alert.type}
          message={alert.message}
          duration={alert.duration}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </div>
  );
};

// Alert context for managing alerts
import { createContext, useContext } from 'react';

const AlertContext = createContext(null);

export const useAlerts = () => useContext(AlertContext);

// Alert provider component
export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  
  const addAlert = (type, message, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setAlerts([...alerts, { id, type, message, duration }]);
    return id;
  };
  
  const removeAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };
  
  // Helper methods for different alert types
  const showSuccess = (message, duration) => addAlert('success', message, duration);
  const showError = (message, duration) => addAlert('error', message, duration);
  const showInfo = (message, duration) => addAlert('info', message, duration);
  const showWarning = (message, duration) => addAlert('warning', message, duration);
  
  return (
    <AlertContext.Provider value={{ 
      alerts, 
      addAlert, 
      removeAlert, 
      showSuccess, 
      showError, 
      showInfo, 
      showWarning 
    }}>
      {children}
      <AlertContainer alerts={alerts} removeAlert={removeAlert} />
    </AlertContext.Provider>
  );
};

export default AlertMessage; 