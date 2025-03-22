import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';

function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    unit: '',
    stock: '',
    status: 'Active',
    description: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    // Navigate back to products list after submission
    navigate('/farmer/products');
  };

  const categories = [
    'Vegetables',
    'Fruits',
    'Dairy',
    'Meat',
    'Honey & Preserves',
    'Grains',
    'Herbs & Spices'
  ];

  return (
    <div className="min-h-screen bg-[#1a332e]">
      <Navbar />
      <div className="pt-24 px-6">
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
                  <label className="block text-gray-300 mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full bg-[#1a332e] text-white pl-8 pr-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Unit</label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    placeholder="lb, oz, each, etc."
                    className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
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
              />
            </div>

            {/* Product Images Section */}
            <div className="bg-[#2d4f47] rounded-xl p-6 border border-teal-500/20">
              <h2 className="text-xl font-bold text-white mb-6">Product Images</h2>
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
                className="bg-teal-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-600 transition-colors"
              >
                Add Product
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
