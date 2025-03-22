import { toast } from 'react-toastify';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import React from 'react';

// Custom toast configuration
const toastConfig = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

// Success notification
export const showSuccess = (message) => {
  toast.success(
    <div className="flex items-start">
      <CheckCircle className="text-green-400 mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
      <div>
        <p className="font-semibold text-white">{message}</p>
      </div>
    </div>,
    toastConfig
  );
};

// Error notification
export const showError = (message) => {
  toast.error(
    <div className="flex items-start">
      <AlertCircle className="text-red-400 mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
      <div>
        <p className="font-semibold text-white">{message}</p>
      </div>
    </div>,
    toastConfig
  );
};

// Info notification
export const showInfo = (message) => {
  toast.info(
    <div className="flex items-start">
      <Info className="text-blue-400 mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
      <div>
        <p className="font-semibold text-white">{message}</p>
      </div>
    </div>,
    toastConfig
  );
};

// Warning notification
export const showWarning = (message) => {
  toast.warning(
    <div className="flex items-start">
      <AlertTriangle className="text-yellow-400 mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
      <div>
        <p className="font-semibold text-white">{message}</p>
      </div>
    </div>,
    toastConfig
  );
};

// Loading notification with custom ID for updating later
export const showLoading = (message, toastId = 'loading-toast') => {
  return toast.loading(
    <div className="flex items-start">
      <div className="animate-spin mr-2 h-5 w-5 border-2 border-teal-400 border-t-transparent rounded-full" />
      <div>
        <p className="font-semibold text-white">{message}</p>
      </div>
    </div>,
    {
      ...toastConfig,
      toastId,
      autoClose: false,
    }
  );
};

// Update loading toast to a success/error
export const updateLoadingToast = (toastId, type, message) => {
  if (type === 'success') {
    toast.update(toastId, {
      render: (
        <div className="flex items-start">
          <CheckCircle className="text-green-400 mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-white">{message}</p>
          </div>
        </div>
      ),
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });
  } else if (type === 'error') {
    toast.update(toastId, {
      render: (
        <div className="flex items-start">
          <AlertCircle className="text-red-400 mr-2 mt-0.5 h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-white">{message}</p>
          </div>
        </div>
      ),
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  }
}; 