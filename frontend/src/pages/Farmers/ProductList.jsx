import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  AlertCircle,
  ListFilter,
  LayoutGrid,
  List,
  ShoppingCart, // Added missing import
} from "lucide-react";
import Navbar from "../../components/Navbar";
import {
  getFarmerProducts,
  deleteProduct,
} from "../../redux/slices/ProductSlice";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

function ProductList() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Get products from Redux store
  const { farmerProducts, loading, error } = useSelector(
    (state) => state.products
  );

  // Get query params if the user navigated from another page with a search term
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    const category = params.get("category");
    
    if (query) {
      setSearchTerm(query);
    }
    
    if (category) {
      setFilterCategory(category);
    }
  }, [location.search]);

  // Format product data with safety checks
  const formatProducts = (products) => {
    if (!products || !Array.isArray(products) || products.length === 0) {
      return [];
    }

    return products.map((product) => {
      // Process image URL to ensure it's complete
      let imageUrl = product.image_url || null;
      if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = `http://localhost:5000${
          imageUrl.startsWith("/") ? "" : "/"
        }${imageUrl}`;
      }

      // Calculate discounted price if discount exists
      const originalPrice = product.price || 0;
      const discount = product.discount || 0;
      const discountedPrice = discount > 0 
        ? originalPrice * (1 - discount / 100) 
        : originalPrice;

      // Format unit display
      const unitDisplay = product.unit || 'kg';

      return {
        id: product._id,
        name: product.name || "Unnamed Product",
        category: product.category || "Uncategorized",
        price: originalPrice,
        discountedPrice: discountedPrice,
        discount: discount,
        unit: unitDisplay,
        stock: product.available_quantity || 0,
        status: product.available_quantity > 0 ? "Active" : "Out of Stock",
        image_url: imageUrl || "https://placehold.co/100x100/1a332e/white?text=Product",
        description: product.description || "",
        traceability: product.traceability || {},
      };
    });
  };

  // Load products on component mount and when user data becomes available
  useEffect(() => {
    const farmerId = user?.id || user?._id;

    if (farmerId) {
      dispatch(getFarmerProducts(farmerId))
        .then(() => {
          setIsInitialLoad(false);
        })
        .catch(() => {
          setIsInitialLoad(false);
        });
    } else if (isAuthenticated === false) {
      setIsInitialLoad(false);
    }
  }, [dispatch, user, isAuthenticated]);

  // Apply search and filters
  const filteredProducts = farmerProducts && Array.isArray(farmerProducts)
    ? formatProducts(farmerProducts).filter((product) => {
        const matchesSearch = searchTerm
          ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
          : true;
          
        const matchesCategory = filterCategory
          ? product.category === filterCategory
          : true;
          
        return matchesSearch && matchesCategory;
      })
    : [];

  // Get unique categories for filter dropdown
  const categories = farmerProducts && Array.isArray(farmerProducts)
    ? [...new Set(formatProducts(farmerProducts).map(p => p.category).filter(c => c))]
    : [];

  // Show loading during initial page load but not during subsequent fetches
  const showLoading = loading && isInitialLoad;

  // Handle empty products state more gracefully
  const showEmptyState = !showLoading && !error && 
    (filteredProducts.length === 0 || !farmerProducts || !Array.isArray(farmerProducts));

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Update URL query parameter for bookmarking/sharing
    const searchParams = new URLSearchParams();
    if (searchTerm) {
      searchParams.append("q", searchTerm);
    }
    if (filterCategory) {
      searchParams.append("category", filterCategory);
    }
    
    navigate(`/farmer/products?${searchParams.toString()}`);
  };

  const handleAddProduct = () => {
    navigate("/farmer/add-product");
  };

  const handleEditProduct = (productId) => {
    navigate(`/farmer/edit-product/${productId}`);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const resultAction = await dispatch(deleteProduct(productId));

        if (deleteProduct.fulfilled.match(resultAction)) {
          toast.success("Product deleted successfully");
        } else {
          toast.error(resultAction.payload || "Failed to delete product");
        }
      } catch (error) {
        toast.error("An error occurred while deleting the product");
      }
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    navigate("/farmer/products");
  };

  return (
    <div className="min-h-screen bg-[#1a332e]">
      <Navbar />

      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-white mb-2"
            >
              Manage Products
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-400"
            >
              Add, edit, and manage your farm products for the marketplace
            </motion.p>
          </div>

          {/* Search and Filter Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, category, description..."
                  className="w-full bg-[#2d4f47] text-white pl-10 pr-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
              
              <div className="flex gap-4 flex-wrap">
                <div className="relative">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-[#2d4f47] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500 appearance-none pr-10 min-w-[150px]"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <ListFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
                
                <button
                  type="submit"
                  className="bg-teal-500 text-white px-4 py-2.5 rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Search
                </button>
                
                {(searchTerm || filterCategory) && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="bg-gray-600 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Clear
                  </button>
                )}
                
                {/* View Toggle */}
                <div className="flex bg-[#2d4f47] rounded-lg overflow-hidden">
                  <button 
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-2.5 ${viewMode === 'table' ? 'bg-teal-500 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2.5 ${viewMode === 'grid' ? 'bg-teal-500 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddProduct}
                  type="button"
                  className="bg-teal-500 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-teal-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add New
                </motion.button>
              </div>
            </div>
          </form>

          {/* Loading State */}
          {showLoading && (
            <div className="text-center py-8 text-teal-400">
              <div className="animate-pulse">Loading products...</div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="text-red-400 flex-shrink-0" />
              <p className="text-red-300">{error}</p>
            </div>
          )}
          
          {/* Search Results Count */}
          {!showLoading && !error && searchTerm && !showEmptyState && (
            <div className="mb-4 text-gray-400">
              Found {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for "{searchTerm}"
              {filterCategory ? ` in category "${filterCategory}"` : ''}
            </div>
          )}

          {/* Empty State */}
          {showEmptyState && (
            <div className="bg-[#2d4f47] rounded-xl border border-teal-500/20 p-10 text-center">
              <h3 className="text-white text-lg font-medium mb-2">
                No products found
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || filterCategory
                  ? "No products match your search criteria"
                  : "You haven't added any products yet"}
              </p>
              {!searchTerm && !filterCategory && (
                <button
                  onClick={handleAddProduct}
                  className="bg-teal-500 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-teal-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Product
                </button>
              )}
            </div>
          )}

          {/* Products Table View */}
          {!showLoading && !error && filteredProducts.length > 0 && viewMode === 'table' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#2d4f47] rounded-xl border border-teal-500/20 overflow-hidden"
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b border-teal-500/20">
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">
                      Image
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">
                      Product
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">
                      Category
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">
                      Price
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">
                      Stock
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-teal-500/20 last:border-0"
                    >
                      <td className="py-4 px-6">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/100x100/1a332e/white?text=Product";
                          }}
                        />
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white font-medium">
                          {product.name}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-300">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white">
                          {product.discount > 0 ? (
                            <>
                              <span className="line-through text-gray-400">₹{product.price}</span>
                              <span className="ml-2">₹{product.discountedPrice.toFixed(2)}</span>
                              <span className="ml-2 bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs">
                                {product.discount}% OFF
                              </span>
                            </>
                          ) : (
                            `₹${product.price}`
                          )}
                          /{product.unit}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-white">{product.stock} {product.unit}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            product.status === "Active"
                              ? "bg-teal-500/20 text-teal-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleEditProduct(product.id)}
                            className="text-teal-400 hover:text-teal-300 transition-colors"
                            title="Edit product"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {/* Products Grid View */}
          {!showLoading && !error && filteredProducts.length > 0 && viewMode === 'grid' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#2d4f47] rounded-xl border border-teal-500/20 overflow-hidden hover:border-teal-500/50 transition-colors"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/400x300/1a332e/white?text=Product";
                      }}
                    />
                    <span
                      className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm ${
                        product.status === "Active"
                          ? "bg-teal-500/90 text-white"
                          : "bg-red-500/90 text-white"
                      }`}
                    >
                      {product.status}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-white text-lg font-medium mb-1 truncate">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">{product.category}</p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-white text-lg font-medium">
                        {product.discount > 0 ? (
                          <>
                            <span className="line-through text-gray-400 text-sm">₹{product.price}</span>
                            <span className="ml-1">₹{product.discountedPrice.toFixed(2)}</span>
                          </>
                        ) : (
                          `₹${product.price}`
                        )}
                        /{product.unit}
                      </div>
                      {product.discount > 0 && (
                        <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs font-medium">
                          {product.discount}% OFF
                        </span>
                      )}
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium flex items-center">
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add
                      </button>
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        onClick={() => handleEditProduct(product.id)}
                        className="bg-teal-500/20 text-teal-400 px-3 py-1.5 rounded-lg hover:bg-teal-500/30 transition-colors flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductList;