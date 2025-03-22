import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import ProfilePage from "../profile/ProfilePage";
import ProductList from "./ProductList";
import AddProduct from "./AddProduct";
import FarmerDashboard from "./FarmerDashboard";
import DocumentUpload from "./DocumentUpload";
import FarmerCertificate from "./FarmerCertificate";
import OrderList from "./OrderList";
// import OrderList from './OrderList';

const FarmerRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FarmerDashboard />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/add-product" element={<AddProduct />} />
      {/* <Route path="/products" element={<Products />} /> */}
      {/* <Route path="/products/add" element={<AddProduct />} /> */}
      <Route path="/documents" element={<DocumentUpload />} />
      <Route path="/certificate/:certificateId" element={<FarmerCertificate />}/>
      <Route path="/orders" element={<OrderList />}/>
    </Routes>
  );
};

export default FarmerRoutes;
