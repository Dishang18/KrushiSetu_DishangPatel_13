import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import User from '../models/userModel.js';
import FarmerDocument from '../models/FarmerDocument.js';
import Product from '../models/productModel.js';

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard/stats', authenticate, async (req, res) => {
  console.log('Received request for dashboard stats');
  console.log('User:', req.user);

  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Initialize stats with default values
    const stats = {
      pendingDocuments: 0,
      totalFarmers: 0,
      totalProducts: 0,
      activeOrders: 0,
      certificatesIssued: 0,
      totalRevenue: 0
    };

    try {
      // Get total farmers count
      stats.totalFarmers = await User.countDocuments({ role: 'farmer' });
    } catch (error) {
      console.error('Error counting farmers:', error);
    }

    try {
      // Get pending documents count
      stats.pendingDocuments = await FarmerDocument.countDocuments({
        verificationStatus: 'pending'
      });
    } catch (error) {
      console.error('Error counting pending documents:', error);
    }

    try {
      // Get certificates issued count
      stats.certificatesIssued = await FarmerDocument.countDocuments({
        certificateId: { $exists: true, $ne: null }
      });
    } catch (error) {
      console.error('Error counting certificates:', error);
    }

    try {
      // Get certified farmer IDs first
      const certifiedFarmers = await FarmerDocument.find({
        verificationStatus: 'certified'
      }).select('farmer');

      // Extract farmer IDs
      const certifiedFarmerIds = certifiedFarmers.map(doc => doc.farmer);

      // Count products only from certified farmers
      stats.totalProducts = await Product.countDocuments({
        farmer: { $in: certifiedFarmerIds }
      });
      
      // Calculate revenue only from certified farmers' products
      const products = await Product.find({
        farmer: { $in: certifiedFarmerIds }
      });

      stats.totalRevenue = products.reduce((total, product) => {
        return total + (product.price * product.quantity);
      }, 0);

      console.log('Certified farmers products count:', stats.totalProducts);
      console.log('Revenue from certified farmers:', stats.totalRevenue);
    } catch (error) {
      console.error('Error counting certified farmers products:', error);
      console.error('Detailed error:', {
        message: error.message,
        stack: error.stack
      });
    }

    console.log('Stats gathered:', stats);
    res.json(stats);

  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export const adminRoutes = router; 