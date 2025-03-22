// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate, useLocation } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//   Search,
//   AlertCircle,
//   ListFilter,
//   LayoutGrid,
//   List,
//   ShoppingCart,
//   ChevronDown,
//   Star,
//   MapPin,
//   Plus,
//   Minus,
//   User,
// } from "lucide-react";
// import Navbar from "../../components/Navbar";
// import {
//   getConsumerProducts,
//   getConsumerCategories,
// } from "../../redux/slices/ProductSlice";
// import { addToCart, fetchCart } from "../../redux/slices/CartSlice";
// import { toast } from "react-hot-toast";

// function ConsumerProductList() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterCategory, setFilterCategory] = useState("");
//   const [viewMode, setViewMode] = useState("grid");
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   const [expandedProducts, setExpandedProducts] = useState({});
//   const [quantities, setQuantities] = useState({});

//   // Get products and categories from Redux store
//   const { consumerProducts, categories, loading, error } = useSelector(
//     (state) => state.products
//   );

//   // Get cart state
//   const { items: cartItems, loading: cartLoading } = useSelector(
//     (state) => state.cart
//   );

//   // Parse query parameters on mount
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const search = params.get("q");
//     const category = params.get("category");

//     if (search) setSearchTerm(search);
//     if (category) setFilterCategory(category);
//   }, [location.search]);

//   // Fetch products, categories, and cart on mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch cart first to ensure it exists
//         await dispatch(fetchCart());

//         await dispatch(getConsumerCategories());

//         // Use query params for initial fetch if available
//         const params = new URLSearchParams(location.search);
//         const search = params.get("q");
//         const category = params.get("category");

//         await dispatch(
//           getConsumerProducts({
//             search: search || "",
//             category: category || "",
//           })
//         );

//         setIsInitialLoad(false);
//       } catch (err) {
//         console.error("Error fetching initial data:", err);
//         setIsInitialLoad(false);
//       }
//     };

//     fetchData();
//   }, [dispatch, location.search]);

//   // Initialize quantities state based on products
//   useEffect(() => {
//     if (consumerProducts && consumerProducts.length > 0) {
//       const newQuantities = {};

//       consumerProducts.forEach((product) => {
//         if (product.farmers && product.farmers.length > 0) {
//           product.farmers.forEach((farmer) => {
//             newQuantities[farmer.id] = 1;
//           });
//         }
//       });

//       setQuantities(newQuantities);
//     }
//   }, [consumerProducts]);

//   // Filter products (already filtered on backend, but we can do additional filtering here if needed)
//   const filteredProducts = consumerProducts || [];

//   // Show loading during initial page load but not during subsequent fetches
//   const showLoading = loading && isInitialLoad;

//   // Handle empty products state more gracefully
//   const showEmptyState =
//     !showLoading && !error && filteredProducts.length === 0;

//   const handleSearch = (e) => {
//     e.preventDefault();

//     // Update URL query parameter for bookmarking/sharing
//     const searchParams = new URLSearchParams();
//     if (searchTerm) {
//       searchParams.append("q", searchTerm);
//     }
//     if (filterCategory) {
//       searchParams.append("category", filterCategory);
//     }

//     navigate(`/consumer/shop?${searchParams.toString()}`);

//     // Fetch products with the new search params
//     dispatch(
//       getConsumerProducts({
//         search: searchTerm,
//         category: filterCategory,
//       })
//     );
//   };

//   const clearFilters = () => {
//     setSearchTerm("");
//     setFilterCategory("");
//     navigate("/consumer/shop");

//     // Fetch all products without filters
//     dispatch(getConsumerProducts());
//   };

//   const toggleProductExpand = (productName) => {
//     setExpandedProducts((prev) => ({
//       ...prev,
//       [productName]: !prev[productName],
//     }));
//   };

//   const handleQuantityChange = (productId, newQuantity) => {
//     if (newQuantity >= 1) {
//       setQuantities((prev) => ({
//         ...prev,
//         [productId]: newQuantity,
//       }));
//     }
//   };

//   const navigateToFarmer = (farmerId) => {
//     navigate(`/consumer/farmers/${farmerId}`);
//   };

//   // Enhanced add to cart function with proper error handling
//   const handleAddToCart = (product, farmer) => {
//     const quantity = quantities[farmer.id] || 1;

//     // Check if the requested quantity exceeds available stock
//     if (quantity > farmer.stock) {
//       toast.error(`Only ${farmer.stock} ${farmer.unit} available in stock`);
//       return;
//     }

//     try {
//       dispatch(
//         addToCart({
//           productId: product._id,
//           name: product.name,
//           price: farmer.discountedPrice,
//           originalPrice: farmer.price,
//           discount: farmer.discount,
//           quantity,
//           farmerId: farmer.farmerId,
//           farmerName: farmer.farmerName,
//           image_url: product.image_url,
//           unit: farmer.unit,
//         })
//       ).unwrap()
//         .then(() => {
//           // Show success toast only after successful dispatch
//           toast.success(`Added ${quantity} ${farmer.unit} of ${product.name} to cart`);

//           // Reset quantity after adding to cart
//           setQuantities(prev => ({
//             ...prev,
//             [farmer.id]: 1
//           }));
//         })
//         .catch(error => {
//           console.error("Error adding to cart:", error);
//           // Error is already handled by the thunk with toast
//         });
//     } catch (error) {
//       console.error("Error dispatching add to cart:", error);
//       toast.error("Could not add item to cart");
//     }
//   };

//   // Check if product is already in cart
//   const isInCart = (productId, farmerId) => {
//     return cartItems.some(
//       item => item.productId === productId && item.farmerId === farmerId
//     );
//   };

//   return (
//     <div className="min-h-screen bg-[#1a332e]">
//       <Navbar />

//       <div className="pt-24 px-6">
//         <div className="max-w-7xl mx-auto">
//           {/* Header */}
//           <div className="mb-8">
//             <motion.h1
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-4xl font-bold text-white mb-2"
//             >
//               Marketplace
//             </motion.h1>
//             <motion.p
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="text-gray-400"
//             >
//               Shop fresh, locally grown produce directly from farmers
//             </motion.p>
//           </div>

//           {/* Search and Filter Form */}
//           <form onSubmit={handleSearch} className="mb-6">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="Search products..."
//                   className="w-full bg-[#2d4f47] text-white pl-10 pr-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500 transition-colors"
//                 />
//               </div>

//               <div className="flex gap-4 flex-wrap">
//                 <div className="relative">
//                   <select
//                     value={filterCategory}
//                     onChange={(e) => setFilterCategory(e.target.value)}
//                     className="bg-[#2d4f47] text-white px-4 py-2.5 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500 appearance-none pr-10 min-w-[150px]"
//                   >
//                     <option value="">All Categories</option>
//                     {categories.map((category) => (
//                       <option key={category} value={category}>
//                         {category}
//                       </option>
//                     ))}
//                   </select>
//                   <ListFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
//                 </div>

//                 <button
//                   type="submit"
//                   className="bg-teal-500 text-white px-4 py-2.5 rounded-lg hover:bg-teal-600 transition-colors"
//                 >
//                   Search
//                 </button>

//                 {(searchTerm || filterCategory) && (
//                   <button
//                     type="button"
//                     onClick={clearFilters}
//                     className="bg-gray-600 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
//                   >
//                     Clear
//                   </button>
//                 )}

//                 {/* View Toggle */}
//                 <div className="flex bg-[#2d4f47] rounded-lg overflow-hidden">
//                   <button
//                     type="button"
//                     onClick={() => setViewMode("grid")}
//                     className={`px-3 py-2.5 ${
//                       viewMode === "grid"
//                         ? "bg-teal-500 text-white"
//                         : "text-gray-400 hover:text-white"
//                     }`}
//                   >
//                     <LayoutGrid className="w-5 h-5" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setViewMode("table")}
//                     className={`px-3 py-2.5 ${
//                       viewMode === "table"
//                         ? "bg-teal-500 text-white"
//                         : "text-gray-400 hover:text-white"
//                     }`}
//                   >
//                     <List className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </form>

//           {/* Loading State */}
//           {showLoading && (
//             <div className="text-center py-8 text-teal-400">
//               <div className="animate-pulse">Loading products...</div>
//             </div>
//           )}

//           {/* Error State */}
//           {error && (
//             <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-3">
//               <AlertCircle className="text-red-400 flex-shrink-0" />
//               <p className="text-red-300">{error}</p>
//             </div>
//           )}

//           {/* Search Results Count */}
//           {!showLoading && !error && searchTerm && !showEmptyState && (
//             <div className="mb-4 text-gray-400">
//               Found {filteredProducts.length} result
//               {filteredProducts.length !== 1 ? "s" : ""} for "{searchTerm}"
//               {filterCategory ? ` in category "${filterCategory}"` : ""}
//             </div>
//           )}

//           {/* Empty State */}
//           {showEmptyState && (
//             <div className="bg-[#2d4f47] rounded-xl border border-teal-500/20 p-10 text-center">
//               <h3 className="text-white text-lg font-medium mb-2">
//                 No products found
//               </h3>
//               <p className="text-gray-400 mb-6">
//                 {searchTerm || filterCategory
//                   ? "No products match your search criteria"
//                   : "There are no products available at the moment"}
//               </p>
//             </div>
//           )}

//           {/* Products Grid View */}
//           {!showLoading &&
//             !error &&
//             filteredProducts.length > 0 &&
//             viewMode === "grid" && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//               >
//                 {filteredProducts.map((product) => (
//                   <div
//                     key={product.name}
//                     className="bg-[#2d4f47] rounded-xl border border-teal-500/20 overflow-hidden hover:border-teal-500/50 transition-colors"
//                   >
//                     <div className="h-48 overflow-hidden relative">
//                       <img
//                         src={product.image_url}
//                         alt={product.name}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.target.src =
//                             "https://placehold.co/400x300/1a332e/white?text=Product";
//                         }}
//                       />
//                       <span className="absolute top-2 right-2 px-3 py-1 rounded-full text-sm bg-teal-500/90 text-white">
//                         {product.farmers.length}{" "}
//                         {product.farmers.length === 1 ? "Farmer" : "Farmers"}
//                       </span>
//                     </div>

//                     <div className="p-6">
//                       <h3 className="text-white text-lg font-medium mb-1 truncate">
//                         {product.name}
//                       </h3>
//                       <p className="text-gray-400 text-sm mb-4">
//                         {product.category}
//                       </p>

//                       <p className="text-gray-300 text-sm mb-4 line-clamp-2">
//                         {product.description}
//                       </p>

//                       <div className="flex justify-between items-center mb-4">
//                         <div className="text-white text-lg font-medium">
//                           From ₹{product.lowestPrice.toFixed(2)}
//                         </div>
//                         <button
//                           onClick={() => toggleProductExpand(product.name)}
//                           className={`flex items-center gap-1 px-3 py-1 rounded-lg
//                             ${
//                               expandedProducts[product.name]
//                                 ? "bg-teal-500 text-white"
//                                 : "bg-teal-500/20 text-teal-400 hover:bg-teal-500 hover:text-white"
//                             }`}
//                         >
//                           {expandedProducts[product.name] ? "Hide" : "View"} Farmers
//                           <ChevronDown
//                             className={`w-4 h-4 transition-transform ${
//                               expandedProducts[product.name] ? "rotate-180" : ""
//                             }`}
//                           />
//                         </button>
//                       </div>

//                       {/* Expanded farmers view */}
//                       {expandedProducts[product.name] && (
//                         <div className="mt-4 space-y-3">
//                           {product.farmers.map((farmer) => (
//                             <div
//                               key={farmer.id}
//                               className="bg-[#243c37] rounded-lg p-3"
//                             >
//                               <div className="flex justify-between items-start mb-2">
//                                 <div className="flex items-center gap-2">
//                                   <User className="w-5 h-5 text-teal-400" />
//                                   <div>
//                                     <p className="text-teal-300 font-medium">
//                                       {farmer.farmerName}
//                                     </p>
//                                     <div className="flex items-center text-sm">
//                                       <Star className="w-3 h-3 text-yellow-400 mr-1" />
//                                       <span className="text-yellow-400">
//                                         {farmer.rating.toFixed(1)}
//                                       </span>
//                                     </div>
//                                   </div>
//                                 </div>
//                                 <div className="text-right">
//                                   {farmer.discount > 0 ? (
//                                     <div>
//                                       <span className="line-through text-gray-400 text-sm">
//                                         ₹{farmer.price}
//                                       </span>
//                                       <span className="text-white font-medium ml-1">
//                                         ₹{farmer.discountedPrice.toFixed(2)}
//                                       </span>
//                                       <span className="ml-1 bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs">
//                                         {farmer.discount}% OFF
//                                       </span>
//                                     </div>
//                                   ) : (
//                                     <span className="text-white font-medium">
//                                       ₹{farmer.price}
//                                     </span>
//                                   )}
//                                   <span className="text-gray-400 text-sm">
//                                     /{farmer.unit}
//                                   </span>
//                                 </div>
//                               </div>

//                               <div className="flex items-center text-sm text-gray-400 mb-2">
//                                 <MapPin className="w-3 h-3 mr-1" />
//                                 <span className="truncate">{farmer.location}</span>
//                               </div>

//                               <div className="flex gap-2 mt-3">
//                                 <button
//                                   onClick={() => navigateToFarmer(farmer.farmerId)}
//                                   className="flex-1 bg-teal-500/20 text-teal-400 hover:bg-teal-500 hover:text-white rounded-lg py-1 flex items-center justify-center"
//                                 >
//                                   Farmer Details
//                                 </button>
//                               </div>

//                               <div className="flex gap-2 mt-2">
//                                 <div className="flex items-center justify-between bg-[#1a332e] rounded-lg overflow-hidden">
//                                   <button
//                                     onClick={() =>
//                                       handleQuantityChange(
//                                         farmer.id,
//                                         (quantities[farmer.id] || 1) - 1
//                                       )
//                                     }
//                                     className="px-2 py-1 text-gray-400 hover:bg-teal-500/20"
//                                     disabled={cartLoading}
//                                   >
//                                     <Minus className="w-4 h-4" />
//                                   </button>
//                                   <span className="text-white px-2">
//                                     {quantities[farmer.id] || 1}
//                                   </span>
//                                   <button
//                                     onClick={() =>
//                                       handleQuantityChange(
//                                         farmer.id,
//                                         (quantities[farmer.id] || 1) + 1
//                                       )
//                                     }
//                                     className="px-2 py-1 text-gray-400 hover:bg-teal-500/20"
//                                     disabled={cartLoading}
//                                   >
//                                     <Plus className="w-4 h-4" />
//                                   </button>
//                                 </div>

//                                 <button
//                                   onClick={() => handleAddToCart(product, farmer)}
//                                   disabled={farmer.stock <= 0 || cartLoading}
//                                   className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-1
//                                     ${isInCart(product._id, farmer.farmerId)
//                                       ? "bg-green-500 hover:bg-green-600 text-white"
//                                       : farmer.stock > 0
//                                         ? "bg-teal-500 hover:bg-teal-600 text-white"
//                                         : "bg-gray-600 text-gray-400 cursor-not-allowed"
//                                     }`}
//                                 >
//                                   <ShoppingCart className="w-4 h-4" />
//                                   {cartLoading ? "Adding..." :
//                                    isInCart(product._id, farmer.farmerId) ? "Add More" :
//                                    farmer.stock > 0 ? "Add to Cart" : "Out of Stock"}
//                                 </button>
//                               </div>

//                                 <div className="mt-2 flex justify-between text-xs">
//                                 <div className="text-gray-400">
//                                   In Stock:{" "}
//                                   <span className={`${farmer.stock > 5
//                                     ? "text-teal-400"
//                                     : farmer.stock > 0
//                                       ? "text-yellow-400"
//                                       : "text-red-400"}`}>
//                                     {farmer.stock} {farmer.unit}
//                                   </span>
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </motion.div>
//             )}

//           {/* Products Table View */}
//           {!showLoading &&
//             !error &&
//             filteredProducts.length > 0 &&
//             viewMode === "table" && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-[#2d4f47] rounded-xl border border-teal-500/20 overflow-hidden"
//               >
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b border-teal-500/20">
//                       <th className="text-left py-4 px-6 text-gray-400 font-medium">
//                         Product
//                       </th>
//                       <th className="text-left py-4 px-6 text-gray-400 font-medium">
//                         Category
//                       </th>
//                       <th className="text-left py-4 px-6 text-gray-400 font-medium">
//                         Price Range
//                       </th>
//                       <th className="text-left py-4 px-6 text-gray-400 font-medium">
//                         Farmers
//                       </th>
//                       <th className="text-left py-4 px-6 text-gray-400 font-medium">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredProducts.map((product) => (
//                       <React.Fragment key={product.name}>
//                         <tr className="border-b border-teal-500/10">
//                           <td className="py-4 px-6">
//                             <div className="flex items-center gap-3">
//                               <img
//                                 src={product.image_url}
//                                 alt={product.name}
//                                 className="w-12 h-12 rounded-lg object-cover"
//                                 onError={(e) => {
//                                   e.target.src =
//                                     "https://placehold.co/100x100/1a332e/white?text=Product";
//                                 }}
//                               />
//                               <span className="text-white font-medium">
//                                 {product.name}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="py-4 px-6">
//                             <span className="text-gray-300">
//                               {product.category}
//                             </span>
//                           </td>
//                           <td className="py-4 px-6">
//                             <span className="text-white">
//                               From ₹{product.lowestPrice.toFixed(2)}
//                             </span>
//                           </td>
//                           <td className="py-4 px-6">
//                             <span className="bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full">
//                               {product.farmers.length}{" "}
//                               {product.farmers.length === 1
//                                 ? "Farmer"
//                                 : "Farmers"}
//                             </span>
//                           </td>
//                           <td className="py-4 px-6">
//                             <button
//                               onClick={() => toggleProductExpand(product.name)}
//                               className={`flex items-center gap-1 px-3 py-1 rounded-lg
//                               ${
//                                 expandedProducts[product.name]
//                                   ? "bg-teal-500 text-white"
//                                   : "bg-teal-500/20 text-teal-400"
//                               }`}
//                             >
//                               {expandedProducts[product.name] ? "Hide" : "Show"}{" "}
//                               Farmers
//                               <ChevronDown
//                                 className={`w-4 h-4 transition-transform ${
//                                   expandedProducts[product.name]
//                                     ? "rotate-180"
//                                     : ""
//                                 }`}
//                               />
//                             </button>
//                           </td>
//                         </tr>

//                         {expandedProducts[product.name] && (
//                           <tr>
//                             <td colSpan="5" className="bg-[#243c37] p-0">
//                               <div className="p-4">
//                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                   {product.farmers.map((farmer) => (
//                                     <div
//                                       key={farmer.id}
//                                       className="bg-[#2d4f47] rounded-lg p-3"
//                                     >
//                                       <div className="flex justify-between items-start mb-2">
//                                         <div>
//                                           <p className="text-teal-300 font-medium">
//                                             {farmer.farmerName}
//                                           </p>
//                                           <div className="flex items-center text-sm">
//                                             <Star className="w-4 h-4 text-yellow-400 mr-1" />
//                                             <span className="text-yellow-400">
//                                               {farmer.rating.toFixed(1)}
//                                             </span>
//                                           </div>
//                                         </div>
//                                         <div className="text-right">
//                                           {farmer.discount > 0 ? (
//                                             <div>
//                                               <span className="line-through text-gray-400 text-sm">
//                                                 ₹{farmer.price}
//                                               </span>
//                                               <span className="text-white font-medium ml-1">
//                                                 ₹{farmer.discountedPrice.toFixed(2)}
//                                               </span>
//                                               <span className="ml-1 bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs">
//                                                 {farmer.discount}% OFF
//                                               </span>
//                                             </div>
//                                           ) : (
//                                             <span className="text-white font-medium">
//                                               ₹{farmer.price}
//                                             </span>
//                                           )}
//                                           <span className="text-gray-400 text-sm">
//                                             /{farmer.unit}
//                                           </span>
//                                         </div>
//                                       </div>

//                                       <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
//                                         <div className="flex items-center">
//                                           <MapPin className="w-3 h-3 mr-1" />
//                                           {farmer.location}
//                                         </div>
//                                       </div>

//                                       <div className="flex gap-2 mb-2">
//                                         <button
//                                           onClick={() => navigateToFarmer(farmer.farmerId)}
//                                           className="flex-1 bg-teal-500/20 text-teal-400 hover:bg-teal-500 hover:text-white rounded-lg py-1 flex items-center justify-center"
//                                         >
//                                           See Farmer Details
//                                         </button>
//                                       </div>

//                                       <div className="flex gap-2">
//                                         <div className="flex items-center justify-between bg-[#1a332e] rounded-lg overflow-hidden">
//                                           <button
//                                             onClick={() =>
//                                               handleQuantityChange(
//                                                 farmer.id,
//                                                 (quantities[farmer.id] || 1) - 1
//                                               )
//                                             }
//                                             className="px-2 py-1 text-gray-400 hover:bg-teal-500/20"
//                                             disabled={cartLoading}
//                                           >
//                                             <Minus className="w-4 h-4" />
//                                           </button>
//                                           <span className="text-white px-2">
//                                             {quantities[farmer.id] || 1}
//                                           </span>
//                                           <button
//                                             onClick={() =>
//                                               handleQuantityChange(
//                                                 farmer.id,
//                                                 (quantities[farmer.id] || 1) + 1
//                                               )
//                                             }
//                                             className="px-2 py-1 text-gray-400 hover:bg-teal-500/20"
//                                             disabled={cartLoading}
//                                           >
//                                             <Plus className="w-4 h-4" />
//                                           </button>
//                                         </div>

//                                         <button
//                                           onClick={() => handleAddToCart(product, farmer)}
//                                           disabled={farmer.stock <= 0 || cartLoading}
//                                           className={`flex-1 flex items-center justify-center gap-1 rounded-lg py-1
//                                             ${isInCart(product._id, farmer.farmerId)
//                                               ? "bg-green-500 hover:bg-green-600 text-white"
//                                               : farmer.stock > 0
//                                                 ? "bg-teal-500 hover:bg-teal-600 text-white"
//                                                 : "bg-gray-600 text-gray-400 cursor-not-allowed"
//                                             }`}
//                                         >
//                                           <ShoppingCart className="w-4 h-4" />
//                                           {cartLoading ? "Adding..." :
//                                            isInCart(product._id, farmer.farmerId) ? "Add More" :
//                                            farmer.stock > 0 ? "Add to Cart" : "Out of Stock"}
//                                         </button>
//                                       </div>

//                                       <div className="mt-2 flex justify-between text-xs">
//                                         <div className="text-gray-400">
//                                           Quality:{" "}
//                                           <span className="text-teal-400">
//                                             {farmer.qualityGrade}
//                                           </span>
//                                         </div>
//                                         <div className="text-gray-400">
//                                           Harvested:{" "}
//                                           <span className="text-teal-400">
//                                             {farmer.harvestDate || 'N/A'}
//                                           </span>
//                                         </div>
//                                       </div>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>
//                     ))}
//                   </tbody>
//                 </table>
//               </motion.div>
//             )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ConsumerProductList;

import React from "react";

const ConsumerProductList = () => {
  return <div>ConsumerProductList</div>;
};
export default ConsumerProductList;
