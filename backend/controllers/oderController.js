import Order from '../models/Order.js';
import Product from '../models/productModel.js';
import mongoose from 'mongoose';

// Create a new order and update product quantities
export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { 
      consumer_id,
      items, 
      address, 
      payment
    } = req.body;

    // Process each item in the cart
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      // Find the product to verify availability
      const product = await Product.findById(item.product_id).session(session);
      
      if (!product) {
        throw new Error(`Product not found: ${item.product_id}`);
      }
      
      if (product.available_quantity < item.quantity) {
        throw new Error(`Not enough quantity available for ${product.name}`);
      }
      
      // Calculate price (with discount if applicable)
      const discountedPrice = product.discount > 0 
        ? product.price - (product.price * product.discount / 100)
        : product.price;
      
      const itemTotal = discountedPrice * item.quantity;
      totalAmount += itemTotal;
      
      // Add to order items
      orderItems.push({
        product_id: product._id,
        farmer_id: product.farmer_id,
        quantity: item.quantity,
        price: itemTotal
      });
      
      // Update product quantity
      product.available_quantity -= item.quantity;
      await product.save({ session });
    }
    
    // Create new order
    const newOrder = new Order({
      consumer_id,
      items: orderItems,
      address,
      payment: {
        ...payment,
        amount: totalAmount
      }
    });
    
    await newOrder.save({ session });
    
    // Commit the transaction
    await session.commitTransaction();
    
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: newOrder
    });
    
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    console.error('Order creation failed:', error);
    
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to place order'
    });
  } finally {
    session.endSession();
  }
};

// Get orders for a consumer
export const getConsumerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ consumer_id: req.params.consumerId })
                            .populate('items.product_id', 'name image_url')
                            .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};

// Get orders for a farmer
export const getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.farmer_id': req.params.farmerId })
                            .populate('items.product_id', 'name image_url')
                            .populate('consumer_id', 'name')
                            .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};