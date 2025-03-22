import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct, clearProductMessages } from '../../redux/slices/ProductSlice';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

function AddProduct() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  // Get Redux state
  const products = useSelector(state => state.products) || { loading: false };
  const isLoading = products.loading;
  const error = products.error;
  const successMessage = products.successMessage;
  
  // Properly structured initial state with nested traceability object
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    available_quantity: '',
    unit: 'kg', // Default unit is kg
    description: '',
    discount: 0, // Initialize discount at 0%
    traceability: {
      harvest_method: 'Organic',
      harvest_date: ''
    }
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Handle Redux success/error messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearProductMessages());
      navigate('/farmer/products');
    }
    
    if (error) {
      toast.error(error);
      dispatch(clearProductMessages());
    }
  }, [successMessage, error, dispatch, navigate]);

  // Properly handle nested state updates
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested traceability fields
    if (name.startsWith('traceability.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        traceability: {
          ...prev.traceability,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started");
    
    // Validate required fields
    if (!formData.name || !formData.category || !formData.price || !formData.available_quantity) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Validate discount is between 0-100
    if (formData.discount < 0 || formData.discount > 100) {
      toast.error('Discount must be between 0 and 100 percent');
      return;
    }
    
    if (!imageFile) {
      toast.error('Please upload a product image');
      return;
    }
    
    // Create a FormData object to send multipart/form-data
    const submitFormData = new FormData();
    
    // Append basic product details
    submitFormData.append('name', formData.name);
    submitFormData.append('category', formData.category);
    submitFormData.append('price', formData.price);
    submitFormData.append('discount', formData.discount);
    submitFormData.append('available_quantity', formData.available_quantity);
    submitFormData.append('unit', formData.unit);
    submitFormData.append('description', formData.description);
    
    // Make sure we're sending the correct farmer ID
    const farmerId = user._id || user.id;
    if (!farmerId) {
      toast.error('Unable to identify farmer. Please try logging out and in again.');
      return;
    }
    
    submitFormData.append('farmer_id', farmerId);
    
    // Correctly access the traceability data from formData and convert to JSON
    const traceabilityData = {
      harvest_method: formData.traceability.harvest_method || "Organic",
      harvest_date: formData.traceability.harvest_date || ""
    };
    
    console.log("Sending traceability data:", traceabilityData);
    
    // Convert traceability object to JSON string and append it
    submitFormData.append("traceability", JSON.stringify(traceabilityData));
    
    // Append the image file
    submitFormData.append('image', imageFile);
    
    // Debug: Log the form data keys
    console.log("Form data keys:");
    for (let key of submitFormData.keys()) {
      console.log(`- ${key}: ${key === 'image' ? '[File object]' : submitFormData.get(key)}`);
    }
    
    try {
      // Dispatch the Redux action
      const resultAction = await dispatch(createProduct(submitFormData));
      
      if (createProduct.rejected.match(resultAction)) {
        console.error("Product creation failed:", resultAction.payload);
        toast.error(resultAction.payload || "Failed to create product");
      } else {
        console.log("Product created successfully:", resultAction.payload);
      }
    } catch (error) {
      console.error("Error during dispatch:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const categories = [
    'Vegetables',
    'Fruits',
    'Dairy',
    'Grains',
    'Spices',
    'Herbs',
    'Other'
  ];
  
  const harvestMethods = [
    'Organic',
    'Conventional',
    'Hydroponic',
    'Aquaponic',
    'Other'
  ];

  const units = [
    'kg',
    'g',
    'lb',
    'pieces',
    'bunches',
    'liters',
    'ml',
    'units'
  ];
  
  return (
    <div className="min-h-screen bg-[#1a332e]">
      <Navbar />
      <div className="pt-24 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            to="/farmer/products"
            className="inline-flex items-center text-teal-400 hover:text-teal-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Products
          </Link>

          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Add New Product</h1>
            <p className="text-gray-400">Add a new product to sell in the marketplace</p>
          </motion.div>

          {/* Form */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Product Information Section */}
            <div className="bg-[#2d4f47] rounded-xl p-6 border border-teal-500/20">
              <h2 className="text-xl font-bold text-white mb-6">Product Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Product Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Category*</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Added price, unit and quantity on same row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="block text-gray-300 mb-2">Price (₹)*</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full bg-[#1a332e] text-white pl-8 pr-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Discount (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      max="100"
                      className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                  {formData.discount > 0 && formData.price && (
                    <p className="text-xs text-teal-400 mt-1">
                      Final price: ₹{(formData.price * (1 - formData.discount/100)).toFixed(2)}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Unit*</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    required
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit === 'kg' ? 'Kilogram (kg)' : 
                                                        unit === 'g' ? 'Gram (g)' : 
                                                        unit === 'lb' ? 'Pound (lb)' : 
                                                        unit === 'ml' ? 'Milliliter (ml)' : 
                                                        unit.charAt(0).toUpperCase() + unit.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Add a new row for quantity */}
              <div className="mt-6">
                <label className="block text-gray-300 mb-2">Available Quantity*</label>
                <input
                  type="number"
                  name="available_quantity"
                  value={formData.available_quantity}
                  onChange={handleInputChange}
                  placeholder="Enter available quantity"
                  min="0"
                  className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Enter the total quantity available for sale, in the selected unit.</p>
              </div>
            </div>

            {/* Product Description Section */}
            <div className="bg-[#2d4f47] rounded-xl p-6 border border-teal-500/20">
              <h2 className="text-xl font-bold text-white mb-6">Product Description</h2>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your product..."
                rows="4"
                className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                required
              />
            </div>
            
            {/* Traceability Section */}
            <div className="bg-[#2d4f47] rounded-xl p-6 border border-teal-500/20">
              <h2 className="text-xl font-bold text-white mb-6">Product Traceability</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Harvest Method</label>
                  <select
                    name="traceability.harvest_method"
                    value={formData.traceability.harvest_method}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                  >
                    {harvestMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Harvest Date</label>
                  <input
                    type="date"
                    name="traceability.harvest_date"
                    value={formData.traceability.harvest_date}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            {/* Product Image Section */}
            <div className="bg-[#2d4f47] rounded-xl p-6 border border-teal-500/20">
              <h2 className="text-xl font-bold text-white mb-6">Product Image*</h2>
              <div className="border-2 border-dashed border-teal-500/20 rounded-xl p-8">
                <div className="text-center">
                  {imagePreview ? (
                    <div className="mb-4">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="mx-auto max-h-64 rounded-lg"
                      />
                    </div>
                  ) : (
                    <Upload className="w-12 h-12 text-teal-400 mx-auto mb-4" />
                  )}
                  <p className="text-white mb-2">Upload main product image</p>
                  <p className="text-gray-400 text-sm mb-4">Drag and drop or click to upload (max 5MB)</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-block bg-teal-500/20 text-teal-400 px-4 py-2 rounded-lg cursor-pointer hover:bg-teal-500/30 transition-colors"
                  >
                    Select File
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="bg-teal-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Add Product'
                )}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;