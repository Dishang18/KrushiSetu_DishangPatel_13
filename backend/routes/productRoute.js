import express from "express";
import { addProduct,getProductbyId,getAllProducts, searchProductByCatagory,editProducts,deleteProducts } from "../controllers/productController.js";

const router = express.Router();

router.post("/add-product", addProduct);
router.get("/farmer/:farmer_id",getProductbyId);
router.get("/consumer/allproducts",getAllProducts);
router.get("/category/:category",searchProductByCatagory);
router.put("/update/:product_id",editProducts);
router.delete("/delete/:product_id",deleteProducts);
export default router;