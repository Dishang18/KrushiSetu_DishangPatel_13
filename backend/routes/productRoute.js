import express from 'express';
import { 
  createProduct, 
  getProducts, 
  getFarmerProducts,
  getProductById,
  getProductImage,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Create a new product
router.post('/', authenticate, upload.single('image'), createProduct);

// Get all products (public)
router.get('/', getProducts);

// Get products by farmer ID 
router.get('/farmer/:id', authenticate, getFarmerProducts);

// Get product image
router.get('/image/:filename', getProductImage);

router.get('/:id', getProductById);
router.put('/:id', authenticate, upload.single('image'), updateProduct);

// Delete product
router.delete('/:id', authenticate, deleteProduct);

export { router as productRoute };