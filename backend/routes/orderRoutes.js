import express from "express";
const router = express.Router();
import {
  createRazorpayOrder,
  verifyPayment,
  createOrder,
  // getConsumerOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController.js';

// Razorpay related routes
router.post('/create-razorpay-order', createRazorpayOrder);
router.post('/verify-payment', verifyPayment);

// Order management routes
router.post('/create', createOrder);
// router.get('/consumer/:consumer_id', getConsumerOrders);
router.get('/:order_id', getOrderById);
router.patch('/:order_id/status', updateOrderStatus);

export { router as orderRoutes };