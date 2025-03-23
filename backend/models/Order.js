import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  farmer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  quantity: {
    type: Number,
    min: 1
  },
  price: {
    type: Number,
  }
});

const orderSchema = new mongoose.Schema({
  consumer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: {
    type: [orderItemSchema],
    validate: {
      validator: (value) => value.length > 0,
      message: "At least one item is required in the order"
    },
    required: true
  },
  delivery_details: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String }
  },
  payment_method: {
    type: String,
    enum: ['cod', 'razorpay'],
    required: true
  },
  total_amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'delivered', 'cancelled'],
    default: 'pending'
  },
  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
