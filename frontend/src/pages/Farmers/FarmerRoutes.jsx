import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import ProfilePage from "../Profile/ProfilePage";
import ProductList from "./ProductList";
import AddProduct from "./AddProduct";
import FarmerDashboard from "./FarmerDashboard";
import DocumentUpload from "./DocumentUpload";
import FarmerCertificate from "./FarmerCertificate";
import OrderList from "./OrderList";
// import AddProduct from "./AddProduct";
import EditProduct from "./Editproduct";
import NotFound from "../NotFound";
// import OrderList from './OrderList';

const FarmerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FarmerDashboard />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/edit-product/:productId" element={<EditProduct />} />
      <Route path="/documents" element={<DocumentUpload />} />
      <Route path="/certificate/:certificateId" element={<FarmerCertificate />}/>
      <Route path="/orders" element={<OrderList />}/>
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default FarmerRoutes;
