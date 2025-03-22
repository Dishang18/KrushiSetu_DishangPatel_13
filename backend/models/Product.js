import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    farmer_id: { type: String, required: true }, // PostgreSQL Farmer ID
    farmer_mobile: { type: String, required: true },
    farmer_location: { type: String, required: true },
    
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    available_quantity: { type: Number, default: 0 },
    image_url: { type: String, default: "" }, // Product image URL

    qr_code: { type: String, default: "" }, // Blockchain verification hash

    traceability: {
      farm_location: String,
      harvest_date: Date,
      harvest_method: String, // e.g., Organic, Hydroponic
      certified_by: String, // Certification authority
    },
  },
  { timestamps: true } // Automatically adds `createdAt` & `updatedAt`
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
