import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Building, Flag, Landmark, Map } from 'lucide-react';

const PincodeInfoModal = ({ isOpen, onClose, locationData }) => {
  if (!isOpen || !locationData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#1a2e29] text-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-emerald-900 p-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="text-emerald-400" size={20} />
              Location Details
            </h3>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-emerald-900/50 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-5 space-y-4">
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-emerald-400 mt-1" size={18} />
                <div>
                  <h4 className="font-medium text-emerald-300">Pincode</h4>
                  <p>{locationData.pincode || 'Not available'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Flag className="text-emerald-400 mt-1" size={18} />
                <div>
                  <h4 className="font-medium text-emerald-300">State</h4>
                  <p>{locationData.state || 'Not available'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Building className="text-emerald-400 mt-1" size={18} />
                <div>
                  <h4 className="font-medium text-emerald-300">District</h4>
                  <p>{locationData.district || 'Not available'}</p>
                </div>
              </div>
              
              {locationData.block && (
                <div className="flex items-start gap-3">
                  <Landmark className="text-emerald-400 mt-1" size={18} />
                  <div>
                    <h4 className="font-medium text-emerald-300">Block</h4>
                    <p>{locationData.block}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3">
                <Map className="text-emerald-400 mt-1" size={18} />
                <div>
                  <h4 className="font-medium text-emerald-300">Area/Village</h4>
                  <p>{locationData.village || 'Not available'}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-emerald-900/30 text-xs text-center p-3 text-emerald-200">
            This information is fetched from India Post Pincode API based on the pincode provided.
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PincodeInfoModal; 