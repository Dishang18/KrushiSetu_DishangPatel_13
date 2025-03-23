import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount=1000, currency=INR } = req.body;
    
    const options = {
      amount: amount,
      currency: currency,
      receipt: crypto.randomBytes(10).toString('hex')
    };

    const order = await razorpay.orders.create(options);
    
    res.status(200).json({
      success: true,
      orderId: order.id
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order'
    });
  }
};

// Verify Razorpay payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment'
    });
  }
};

// Create order in database
export const createOrder = async (req, res) => {
  try {
    console.log('Received order data:', req.body);

    const {
      items,
      total_amount,
      delivery_details,
      payment_method,
      status,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    console.log(req.body);

    // Validate required fields
    if (!items || !total_amount || !delivery_details || !payment_method) {
      console.log('Missing required fields:', {
        items: !items,
        total_amount: !total_amount,
        delivery_details: !delivery_details,
        payment_method: !payment_method
      });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        required: {
          items: !items,
          total_amount: !total_amount,
          delivery_details: !delivery_details,
          payment_method: !payment_method
        }
      });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items must be a non-empty array'
      });
    }

    // Validate each item in the items array
    for (const item of items) {
      if (!item.product_id || !item.name || !item.price || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have product_id, name, price, and quantity',
          invalidItem: item
        });
      }
    }

    // Validate delivery details
    if (!delivery_details.address || !delivery_details.mobile || !delivery_details.email) {
      console.log('Missing delivery details:', delivery_details);
      return res.status(400).json({
        success: false,
        message: 'Missing delivery details',
        required: {
          address: !delivery_details.address,
          mobile: !delivery_details.mobile,
          email: !delivery_details.email
        }
      });
    }

    // Create order object with conditional Razorpay fields
    const orderData = {
      items,
      total_amount,
      delivery_details,
      payment_method,
      status: status || 'pending'
    };

    // Add Razorpay fields only if payment method is razorpay
    if (payment_method === 'razorpay') {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: 'Missing Razorpay payment details'
        });
      }
      orderData.razorpay_order_id = razorpay_order_id;
      orderData.razorpay_payment_id = razorpay_payment_id;
      orderData.razorpay_signature = razorpay_signature;
    }

    console.log('Creating order with data:', orderData);

    const order = new Order(orderData);
    await order.save();

    console.log('Order created successfully:', order);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    // Log the full error details
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    
    // Check for specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate order ID'
      });
    }

    // Check for MongoDB connection errors
    if (error.name === 'MongoServerError' && error.code === 11600) {
      return res.status(500).json({
        success: false,
        message: 'Database connection error'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all orders for a consumer
// export const getConsumerOrders = async (req, res) => {
//   try {
//     const { consumer_id } = req.params;
//     const orders = await Order.find({ consumer_id })
//       .sort({ createdAt: -1 });
    
//     res.status(200).json({
//       success: true,
//       orders
//     });
//   } catch (error) {
//     console.error('Error fetching consumer orders:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching orders'
//     });
//   }
// };

// Get order details by ID
export const getOrderById = async (req, res) => {
  try {
    const { order_id } = req.params;
    const order = await Order.findById(order_id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order'
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      order_id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status'
    });
  }
};

// Get orders for a specific farmer
export const getFarmerOrders = async (req, res) => {
  try {
    const { farmer_id } = req.params;

    // Find all orders that contain products from this farmer
    const orders = await Order.find({
      'items.farmer_id': farmer_id
    }).sort({ createdAt: -1 });

    // Filter out items in each order to only show this farmer's items
    const farmerOrders = orders.map(order => {
      const farmerItems = order.items.filter(item => item.farmer_id.toString() === farmer_id);
      return {
        ...order.toObject(),
        items: farmerItems,
        // Recalculate total for farmer's items only
        total_amount: farmerItems.reduce((total, item) => total + (item.price * item.quantity), 0)
      };
    });

    res.status(200).json({
      success: true,
      orders: farmerOrders
    });
  } catch (error) {
    console.error('Error fetching farmer orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};
