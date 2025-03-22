import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { ArrowLeft, Upload } from "lucide-react";
import {
  getProductDetails,
  updateProduct,
  clearProductMessages,
} from "../../redux/slices/ProductSlice";
import { getTokenFromCookie } from "../../utils/cookies";
import useAuth from "../../hooks/useAuth";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();

  console.log("User data:", user);
  // Get states from Redux
  const { loading, error, currentProduct, successMessage } = useSelector(
    (state) => state.products
  );

  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    available_quantity: "",
    unit: "kg", // Add default unit
    farmer_id: "",
    "traceability.harvest_date": "",
    "traceability.harvest_method": "",
  });

  // Clear messages when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearProductMessages());
    };
  }, [dispatch]);

  // Fetch product details when component mounts
  useEffect(() => {
    if (productId) {
      dispatch(getProductDetails(productId));
    }
  }, [productId, dispatch]);

  // Set form data when product details are loaded
  useEffect(() => {
    if (currentProduct) {
      console.log("Current product data:", currentProduct);
      setFormData({
        name: currentProduct.name || "",
        description: currentProduct.description || "",
        category: currentProduct.category || "",
        price: currentProduct.price || "",
        available_quantity: currentProduct.available_quantity || "",
        unit: currentProduct.unit || "kg", // Set unit from product data
        farmer_id: currentProduct.farmer_id || user?.id || "",
        "traceability.harvest_date": currentProduct.traceability?.harvest_date
          ? new Date(currentProduct.traceability.harvest_date)
              .toISOString()
              .split("T")[0]
          : "",
        "traceability.harvest_method":
          currentProduct.traceability?.harvest_method || "",
      });

      // Set image preview - Fix image URL construction
      if (currentProduct.image_url) {
        let imageUrl = currentProduct.image_url;
        console.log("Original image URL:", imageUrl);

        // Handle different image URL formats
        if (!imageUrl.startsWith("http")) {
          // For URLs like "/api/products/image/filename.jpg"
          imageUrl = `http://localhost:5000${
            imageUrl.startsWith("/") ? "" : "/"
          }${imageUrl}`;
        }

        console.log("Final image URL to display:", imageUrl);
        setImagePreview(imageUrl);
      }
    }
  }, [currentProduct, user]);

  // Handle success message
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      navigate("/farmer/products");
    }
  }, [successMessage, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = getTokenFromCookie();

      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        return;
      }

      const submitFormData = new FormData();

      // Add basic fields
      submitFormData.append("name", formData.name);
      submitFormData.append("description", formData.description);
      submitFormData.append("category", formData.category);
      submitFormData.append("price", formData.price);
      submitFormData.append("available_quantity", formData.available_quantity);
      submitFormData.append("unit", formData.unit); // Add unit to form data
      submitFormData.append("farmer_id", formData.farmer_id);

      // Extract and format traceability data as JSON
      const traceabilityData = {
        // Removed farm_location
        harvest_date: formData["traceability.harvest_date"] || "",
        harvest_method: formData["traceability.harvest_method"] || "",
      };

      // Log the traceability data for debugging
      console.log("Sending traceability data:", traceabilityData);

      // Append as a JSON string
      submitFormData.append("traceability", JSON.stringify(traceabilityData));

      // Append image if selected
      if (formData.image) {
        submitFormData.append("image", formData.image);
      }

      // Log what's being sent
      console.log("Form data entries:");
      for (let pair of submitFormData.entries()) {
        console.log(
          `${pair[0]}: ${pair[0] === "image" ? "[File object]" : pair[1]}`
        );
      }

      // Dispatch update action
      const resultAction = await dispatch(
        updateProduct({ id: productId, formData: submitFormData })
      );

      if (updateProduct.rejected.match(resultAction)) {
        toast.error(resultAction.payload || "Failed to update product");
      }
    } catch (error) {
      console.error("Error in submit:", error);
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a332e]">
        <Navbar />
        <div className="pt-24 px-6 text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error && !currentProduct) {
    return (
      <div className="min-h-screen bg-[#1a332e]">
        <Navbar />
        <div className="pt-24 px-6 text-center">
          <div className="max-w-md mx-auto bg-red-500/10 rounded-lg p-6">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => navigate("/farmer/products")}
              className="mt-4 text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a332e]">
      <Navbar />

      <div className="pt-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/farmer/products")}
              className="text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Products
            </button>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-2"
            >
              Edit Product
            </motion.h1>
            <p className="text-gray-400">Product ID: {productId}</p>
          </div>

          {/* Edit Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#2d4f47] rounded-xl border border-teal-500/20 p-6"
            onSubmit={handleSubmit}
          >
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Grains">Grains</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Herbs">Herbs</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                  rows="3"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-400 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Unit</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    required
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="g">Gram (g)</option>
                    <option value="lb">Pound (lb)</option>
                    <option value="pieces">Pieces</option>
                    <option value="bunches">Bunches</option>
                    <option value="liters">Liters</option>
                    <option value="ml">Milliliters</option>
                    <option value="units">Units</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">
                    Available Quantity
                  </label>
                  <input
                    type="number"
                    name="available_quantity"
                    value={formData.available_quantity}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>
              </div>

              {/* Traceability Information */}
              <div className="border-t border-teal-500/20 pt-6">
                <h2 className="text-xl text-white mb-4">
                  Traceability Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Removed farm location field */}
                  <div>
                    <label className="block text-gray-400 mb-2">
                      Harvest Date
                    </label>
                    <input
                      type="date"
                      name="traceability.harvest_date"
                      value={formData["traceability.harvest_date"]}
                      onChange={handleInputChange}
                      className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">
                      Harvest Method
                    </label>
                    <select
                      name="traceability.harvest_method"
                      value={formData["traceability.harvest_method"]}
                      onChange={handleInputChange}
                      className="w-full bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    >
                      <option value="Organic">Organic</option>
                      <option value="Conventional">Conventional</option>
                      <option value="Hydroponic">Hydroponic</option>
                      <option value="Biodynamic">Biodynamic</option>
                    </select>
                  </div>
                
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-gray-400 mb-2">
                  Product Image
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-24 h-24 rounded-lg object-cover"
                      onLoad={() =>
                        console.log("Image loaded successfully:", imagePreview)
                      }
                      onError={(e) => {
                        console.error("Error loading image:", imagePreview);
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/100x100/1a332e/white?text=No+Image";
                      }}
                    />
                  )}
                  <label className="cursor-pointer bg-[#1a332e] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 hover:border-teal-500 transition-colors flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || loading}
                  className="bg-teal-500 text-white px-6 py-2.5 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Updating..." : "Update Product"}
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;