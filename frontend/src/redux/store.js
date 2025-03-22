import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import productReducer from './slices/ProductSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    // Add other reducers here as needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['products/createProduct/pending'],
      },

    }),
});

export default store; 