import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

// @desc    Get all farmers with product counts
// @route   GET /api/admin/farmers-products
// @access  Admin
export const getAllFarmersWithProductCounts = async (req, res) => {
  try {
    // Find all users with 'farmer' role
    const farmers = await User.find({ role: 'farmer' }).select('-password');
    console.log(farmers)
    
    // Get product counts for each farmer
    const farmersWithProductCounts = await Promise.all(
      farmers.map(async (farmer) => {
        const productCount = await Product.countDocuments({ farmer_id: farmer._id });
        return {
          ...farmer.toJSON(),
          productCount
        };
      })
    );
    
    res.json({
      success: true,
      farmers: farmersWithProductCounts
    });
  } catch (error) {
    console.error('Error fetching farmers with product counts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch farmers with product counts',
      error: error.message
    });
  }
};


// This is where you would add more admin-related controller functions
