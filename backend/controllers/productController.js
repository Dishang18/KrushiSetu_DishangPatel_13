// Fix the import path to match the actual file name
import mongoose from 'mongoose';
// Correct the import path to match your file structure
import Product from '../models/productModel.js';

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Farmers)
export const createProduct = async (req, res) => {
  try {
    console.log("Creating product, received body:", req.body);
    console.log("File received:", req.file);
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product image is required' 
      });
    }

    const {
      name,
      category,
      price,
      available_quantity,
      description,
      farmer_id,
      unit, // Added unit field
      discount, // Add discount field
    } = req.body;

    const traceability = JSON.parse(req.body.traceability);

    // Validate required fields
    if (!name || !category || !price || !description || !farmer_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required product information'
      });
    }
    
    // Validate available_quantity is provided and is a number
    if (!available_quantity || isNaN(Number(available_quantity))) {
      return res.status(400).json({
        success: false,
        message: 'Available quantity is required and must be a number'
      });
    }

    // Validate discount is between 0-100
    const discountValue = parseFloat(discount) || 0;
    if (discountValue < 0 || discountValue > 100) {
      return res.status(400).json({ 
        success: false, 
        message: 'Discount must be between 0 and 100 percent' 
      });
    }
    
    // Extract traceability fields from the FormData
    Object.keys(req.body).forEach(key => {
      if (key.startsWith('traceability[')) {
        const fieldName = key.replace('traceability[', '').replace(']', '');
        traceability[fieldName] = req.body[key];
        console.log("Extracted traceability field:", fieldName, req.body[key]);
      }
    });
  
    
    console.log("Extracted traceability data:", traceability);

    // Create image URL for frontend access
    const imageUrl = `/api/products/image/${req.file.filename}`;

    // Create new product
    const product = await Product.create({
      name,
      category,
      price: Number(price),
      discount: discountValue,
      available_quantity: Number(available_quantity),
      description,
      unit: unit || 'kg', // Use the unit field correctly
      image_id: req.file.id,
      image_url: imageUrl,
      farmer_id,
      traceability,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    // Build query filters
    const filters = {};
    
    if (req.query.category) {
      filters.category = req.query.category;
    }
    
    if (req.query.minPrice || req.query.maxPrice) {
      filters.price = {};
      if (req.query.minPrice) filters.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filters.price.$lte = Number(req.query.maxPrice);
    }

    // Only show active products
    filters.is_active = true;
    
    const products = await Product.find(filters)
      .sort({ createdAt: -1 })
      .populate('farmer_id', 'name'); // Populate farmer name
    
    res.json({ data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// @desc    Get products by farmer ID
// @route   GET /api/products/farmer/:id
// @access  Private
export const getFarmerProducts = async (req, res) => {
  try {
    const { id } = req.params;
    
    const products = await Product.find({ farmer_id: id })
      .sort({ createdAt: -1 });
    
    res.json({ data: products });
  } catch (error) {
    console.error('Error fetching farmer products:', error);
    res.status(500).json({ message: 'Failed to fetch farmer products' });
  }
};

// @desc    Get product image by filename
// @route   GET /api/products/image/:filename
// @access  Public
export const getProductImage = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'uploads'
    });

    const { filename } = req.params;
    const file = await db.collection('uploads.files').findOne({ filename });

    if (!file) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Set the correct content type
    res.set('Content-Type', file.contentType);
    
    // Stream the file to the response
    bucket.openDownloadStreamByName(filename).pipe(res);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ message: 'Failed to fetch image' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Updating product:", id);
    console.log("Request body:", req.body);
    
    // Create update data object
    const updateData = { ...req.body };
    
    // Handle traceability data - support both JSON string and separate fields
    if (req.body.traceability && typeof req.body.traceability === 'string') {
      // JSON string approach (from frontend)
      try {
        updateData.traceability = JSON.parse(req.body.traceability);
        console.log("Parsed traceability JSON:", updateData.traceability);
      } catch (e) {
        console.error("Error parsing traceability JSON:", e);
        updateData.traceability = {}; // Default if parsing fails
      }
    } else {
      // Separate fields approach
      const traceabilityFields = {};
      
      // Extract traceability fields from the FormData
      Object.keys(req.body).forEach(key => {
        if (key.startsWith('traceability[')) {
          const fieldName = key.replace('traceability[', '').replace(']', '');
          traceabilityFields[fieldName] = req.body[key];
        }
      });
      
      // If direct form fields are provided instead of traceability namespace
      updateData.traceability = {
        harvest_date: traceabilityFields.harvest_date || req.body.harvest_date || '',
        harvest_method: traceabilityFields.harvest_method || req.body.harvest_method || '',
        certified_by: traceabilityFields.certified_by || req.body.certified_by || ''
      };
      
      // Clean up separate fields
      delete updateData.harvest_date;
      delete updateData.harvest_method;
      delete updateData.certified_by;
    }
    
    // Ensure unit is set
    if (!updateData.unit) {
      updateData.unit = 'kg';
    }
    
    // Validate available_quantity is a number
    if (updateData.available_quantity !== undefined) {
      updateData.available_quantity = Number(updateData.available_quantity);
      if (isNaN(updateData.available_quantity) || updateData.available_quantity < 0) {
        return res.status(400).json({
          success: false,
          message: 'Available quantity must be a positive number'
        });
      }
    }
    
    // Validate discount is between 0-100
    if (req.body.discount !== undefined) {
      const discountValue = parseFloat(req.body.discount) || 0;
      if (discountValue < 0 || discountValue > 100) {
        return res.status(400).json({ 
          success: false, 
          message: 'Discount must be between 0 and 100 percent' 
        });
      }
      updateData.discount = discountValue;
    }
    
    console.log("Update data with traceability:", updateData);
    
    // Handle file if uploaded - Fix the image path to match createProduct
    if (req.file) {
      // Use the same path format as in createProduct
      updateData.image_url = `/api/products/image/${req.file.filename}`;
      updateData.image_id = req.file.id;
      console.log("New image path:", updateData.image_url);
    }
    
    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating product',
      error: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the product
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check ownership
    if (product.farmer_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }
    
    // Delete the product's image from GridFS if it exists
    if (product.image_id) {
      const db = mongoose.connection.db;
      const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });
      try {
        await bucket.delete(new mongoose.Types.ObjectId(product.image_id));
      } catch (error) {
        console.error('Error deleting product image:', error);
        // Continue even if image deletion fails
      }
    }
    
    // Delete the product from database
    await Product.findByIdAndDelete(id);
    
    res.json({
      message: 'Product deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.traceability && typeof req.body.traceability === 'string') {
      try {
        req.body.traceability = JSON.parse(req.body.traceability);
        console.log("Parsed traceability data:", req.body.traceability);
      } catch (e) {
        console.error("Error parsing traceability JSON:", e);
      }
    }
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    return res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
};