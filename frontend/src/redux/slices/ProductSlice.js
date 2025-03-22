import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getTokenFromCookie } from '../../utils/cookies';
// Base API URL - adjust if needed 'http://localhost:5000';
const API_URL = 'http://localhost:5000';

// Replace missing axiosInstance with proper axios + auth
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const token = getTokenFromCookie();
      
      if (!token) {
        return rejectWithValue('Authentication required. Please login again.');
      }

      // Ensure productData is valid before sending
      if (!productData || productData.get === undefined) {
        return rejectWithValue('Invalid form data provided');
      }

      console.log("Sending product data:", productData);
      
      const response = await axios.post(`${API_URL}/api/products`, productData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type when sending FormData with files
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error in createProduct:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create product');
    }
  }
);

// Get products for a specific farmer
export const getFarmerProducts = createAsyncThunk(
  'products/getFarmerProducts',
  async (farmerId, { rejectWithValue }) => {
    try {
        const token = getTokenFromCookie();
      
      const response = await axios.get(`${API_URL}/api/products/farmer/${farmerId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch farmer products'
      );
    }
  }
);

// Get all products with optional filtering
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      // Build query string from filters
      const queryString = new URLSearchParams(filters).toString();
      const url = `${API_URL}/api/products${queryString ? `?${queryString}` : ''}`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      );
    }
  }
);

// Similarly fix updateProduct to use axios directly
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = getTokenFromCookie();
      
      if (!token) {
        return rejectWithValue('Authentication required. Please login again.');
      }
      
      const response = await axios.put(`${API_URL}/api/products/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error in updateProduct:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const token = getTokenFromCookie();
      
      if (!token) {
        return rejectWithValue('Authentication required. Please login again.');
      }
      
      const response = await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return { ...response.data, id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete product'
      );
    }
  }
);

export const getProductDetails = createAsyncThunk(
  'products/getProductDetails',
  async (productId, { rejectWithValue }) => {
    try {
      const token = getTokenFromCookie();
      
      if (!token) {
        return rejectWithValue('Authentication required. Please login again.');
      }
      
      const response = await axios.get(`${API_URL}/api/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch product details'
      );
    }
  }
);

// Initial state
const initialState = {
  products: [],
  farmerProducts: [],
  currentProduct: null,
  loading: false,
  error: null,
  successMessage: null
};

// Product slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create product cases
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Product added successfully';
        
        // If the response includes the new product, add it to the farmer's products
        if (action.payload.data) {
          state.farmerProducts = [action.payload.data, ...state.farmerProducts];
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get farmer products cases
      .addCase(getFarmerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFarmerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.farmerProducts = action.payload.data || [];
      })
      .addCase(getFarmerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get all products cases
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data || [];
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Product updated successfully';
        
        // Update the product in both products and farmerProducts arrays
        const updatedProduct = action.payload.data;
        
        state.products = state.products.map(product => 
          product._id === updatedProduct._id ? updatedProduct : product
        );
        
        state.farmerProducts = state.farmerProducts.map(product => 
          product._id === updatedProduct._id ? updatedProduct : product
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete product cases
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Product deleted successfully';
        
        // Remove the product from both arrays
        const deletedId = action.payload.id;
        
        state.products = state.products.filter(product => product._id !== deletedId);
        state.farmerProducts = state.farmerProducts.filter(product => product._id !== deletedId);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentProduct = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both response formats: {product: {...}} or direct product object
        state.currentProduct = action.payload.product || action.payload;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentProduct = null;
      });
  }
});

export const { clearProductMessages } = productSlice.actions;
export default productSlice.reducer;