import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Vegetables', 'Fruits', 'Dairy', 'Grains', 'Spices', 'Herbs', 'Other']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  units:{
    type: String,
    required: [true, 'Units are required']
  },
  available_quantity: {
    type: Number,
    required: [true, 'Available quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  image_id: {
    type: mongoose.Schema.Types.ObjectId
  },
  image_url: {
    type: String
  },
  farmer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Farmer ID is required']
  },
  traceability: {
    farm_location: String,
    harvest_method: {
      type: String,
      enum: ['Organic', 'Conventional', 'Hydroponic', 'Aquaponic', 'Other'],
      default: 'Organic'
    },
    harvest_date: Date
  },
  is_active: {
    type: Boolean,
    default: true
  },
  discount :{
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add text search index
productSchema.index({ name: 'text', description: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;