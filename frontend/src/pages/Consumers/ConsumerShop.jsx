import React, { useState } from "react";
import Navbar from "./Navbar";
import { 
  Filter, 
  ShoppingCart, 
  Search, 
  ChevronDown, 
  Star, 
  Heart, 
  Grid, 
  List,
  SlidersHorizontal,
  Clock,
  ArrowUpDown
} from "lucide-react";
import { Link } from "react-router-dom";

const ConsumerShop = () => {
  // Current date/time and user from the provided information
  const currentDateTime = "2025-03-20 08:29:05";
  const username = "Dishang18";
  
  // State for filters
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("popularity");
  const [showFilters, setShowFilters] = useState(false);

  // Product categories
  const categories = [
    { id: "all", name: "All Products", count: 156 },
    { id: "vegetables", name: "Vegetables", count: 48 },
    { id: "fruits", name: "Fruits", count: 36 },
    { id: "grains", name: "Grains & Pulses", count: 29 },
    { id: "dairy", name: "Dairy & Eggs", count: 15 },
    { id: "spices", name: "Spices", count: 18 },
    { id: "organic", name: "Organic Products", count: 42 }
  ];

  // Product data
  const products = [
    {
      id: 1,
      name: "Organic Red Tomatoes",
      category: "vegetables",
      price: 80,
      unit: "kg",
      rating: 4.8,
      reviewCount: 124,
      farm: "Krishna Organic Farms",
      image: "🍅",
      isBestseller: true,
      isOrganic: true,
    },
    {
      id: 2,
      name: "Fresh Green Spinach",
      category: "vegetables",
      price: 60,
      unit: "bundle",
      rating: 4.5,
      reviewCount: 89,
      farm: "Patel Farms",
      image: "🥬",
      isBestseller: false,
      isOrganic: true,
    },
    {
      id: 3,
      name: "Basmati Rice",
      category: "grains",
      price: 180,
      unit: "kg",
      rating: 4.9,
      reviewCount: 205,
      farm: "Green Valley Grains",
      image: "🌾",
      isBestseller: true,
      isOrganic: false,
    },
    {
      id: 4,
      name: "Alphonso Mangoes",
      category: "fruits",
      price: 450,
      unit: "dozen",
      rating: 4.9,
      reviewCount: 178,
      farm: "Ratnagiri Orchards",
      image: "🥭",
      isBestseller: true,
      isOrganic: true,
    },
    {
      id: 5,
      name: "Pure Buffalo Milk",
      category: "dairy",
      price: 75,
      unit: "liter",
      rating: 4.7,
      reviewCount: 112,
      farm: "Happy Cows Dairy",
      image: "🥛",
      isBestseller: false,
      isOrganic: true,
    },
    {
      id: 6,
      name: "Red Chilli Powder",
      category: "spices",
      price: 220,
      unit: "500g",
      rating: 4.6,
      reviewCount: 95,
      farm: "Spice Garden",
      image: "🌶️",
      isBestseller: false,
      isOrganic: false,
    },
    {
      id: 7,
      name: "Fresh Green Peas",
      category: "vegetables",
      price: 120,
      unit: "kg",
      rating: 4.5,
      reviewCount: 76,
      farm: "Himalayan Produce",
      image: "🫛",
      isBestseller: false,
      isOrganic: true,
    },
    {
      id: 8,
      name: "Farm Fresh Eggs",
      category: "dairy",
      price: 90,
      unit: "dozen",
      rating: 4.8,
      reviewCount: 154,
      farm: "Free Range Farms",
      image: "🥚",
      isBestseller: true,
      isOrganic: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Component */}
      <Navbar />

      {/* Main Content */}
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header with Breadcrumb and Current Time */}
        <div className="flex flex-wrap justify-between items-center mt-4 mb-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">
              <Link to="/" className="hover:text-green-600">Home</Link> &gt; 
              <Link to="/consumer/dashboard" className="hover:text-green-600 mx-1">Dashboard</Link> &gt; 
              <span className="text-gray-700">Shop</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Agricultural Products</h1>
          </div>
          <div className="flex items-center text-gray-500 mt-2 sm:mt-0 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100">
            <Clock className="h-4 w-4 mr-2 text-green-600" />
            <span className="text-sm">{currentDateTime}</span>
          </div>
        </div>

        {/* Search and View Options */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Search Bar */}
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Filter Toggle (Mobile) */}
            <button 
              className="md:hidden flex items-center text-gray-700 bg-gray-100 px-4 py-2 rounded-lg"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>

            {/* View and Sort Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-lg">
                <button
                  className={`p-2 rounded-l-lg ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-600'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  className={`p-2 rounded-r-lg ${viewMode === 'list' ? 'bg-green-600 text-white' : 'text-gray-600'}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <div className="relative">
                <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
                  <span className="text-sm text-gray-700 mr-1">Sort by:</span>
                  <span className="text-sm font-medium text-gray-900 mr-1">
                    {sortBy === 'popularity' ? 'Popularity' : 
                     sortBy === 'price-low' ? 'Price: Low to High' : 
                     sortBy === 'price-high' ? 'Price: High to Low' : 
                     'Latest'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
                {/* Dropdown content would go here */}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          {/* Sidebar Filters */}
          <div className={`${!showFilters && 'hidden'} md:block w-full md:w-1/4 space-y-6`}>
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category.id}>
                    <button
                      className={`flex items-center justify-between w-full px-2 py-1.5 rounded-md text-left ${
                        selectedCategory === category.name ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      <span>{category.name}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
              <div className="px-2">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 text-sm">₹{priceRange[0]}</span>
                  <span className="text-gray-600 text-sm">₹{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[1]}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                />
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <h3 className="font-medium text-gray-900 mb-3">Product Filters</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                  <span className="text-gray-700">Organic Only</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                  <span className="text-gray-700">Free Delivery</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                  <span className="text-gray-700">Bestsellers</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                  <span className="text-gray-700">New Arrivals</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                  <span className="text-gray-700">Discounted</span>
                </label>
              </div>
            </div>

            {/* Farms */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <h3 className="font-medium text-gray-900 mb-3">Farms</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                  <span className="text-gray-700">Krishna Organic Farms</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                  <span className="text-gray-700">Patel Farms</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                  <span className="text-gray-700">Green Valley Grains</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                  <span className="text-gray-700">Ratnagiri Orchards</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded text-green-600 focus:ring-green-500" />
                  <span className="text-gray-700">Happy Cows Dairy</span>
                </label>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="w-full md:w-3/4">
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {products.map(product => (
                viewMode === 'grid' ? (
                  // Grid View
                  <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <div className="h-48 bg-gray-50 flex items-center justify-center text-6xl">
                        {product.image}
                      </div>
                      <button className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow hover:bg-gray-100">
                        <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                      </button>
                      {product.isBestseller && (
                        <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                          BESTSELLER
                        </div>
                      )}
                      {product.isOrganic && (
                        <div className="absolute bottom-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                          ORGANIC
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-1">
                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                        <span className="text-amber-400 font-medium text-sm ml-1">{product.rating}</span>
                        <span className="text-gray-400 text-xs ml-1">({product.reviewCount})</span>
                      </div>
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">{product.farm}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="font-bold text-gray-900">₹{product.price}/{product.unit}</span>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium flex items-center">
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View
                  <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative w-full sm:w-1/4">
                        <div className="h-48 sm:h-full bg-gray-50 flex items-center justify-center text-6xl">
                          {product.image}
                        </div>
                        {product.isBestseller && (
                          <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                            BESTSELLER
                          </div>
                        )}
                        {product.isOrganic && (
                          <div className="absolute bottom-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                            ORGANIC
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-amber-400 fill-current" />
                              <span className="text-amber-400 font-medium text-sm ml-1">{product.rating}</span>
                              <span className="text-gray-400 text-xs ml-1">({product.reviewCount})</span>
                            </div>
                            <button className="p-1.5 rounded-full hover:bg-gray-100">
                              <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                          <h3 className="font-medium text-gray-900 text-lg">{product.name}</h3>
                          <p className="text-gray-500 text-sm mt-1">{product.farm}</p>
                          <p className="text-gray-600 mt-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vitae nulla sit amet turpis facilisis auctor.
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <span className="font-bold text-lg text-gray-900">₹{product.price}/{product.unit}</span>
                          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium flex items-center">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">&laquo;</button>
                <button className="px-3 py-1 rounded-md bg-green-600 text-white">1</button>
                <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">2</button>
                <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">3</button>
                <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">&raquo;</button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Tray Button */}
      <button 
        className="md:hidden fixed bottom-6 right-6 bg-green-600 text-white p-3 rounded-full shadow-lg z-10"
        onClick={() => setShowFilters(!showFilters)}
      >
        <SlidersHorizontal className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ConsumerShop;