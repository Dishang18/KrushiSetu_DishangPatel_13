import express from 'express';
import { 
  createOrder, 
  getConsumerOrders, 
  getFarmerOrders 
} from '../controllers/oderController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, createOrder);
router.get('/consumer/:consumerId', authenticate, getConsumerOrders);
router.get('/farmer/:farmerId', authenticate, getFarmerOrders);

export default router;