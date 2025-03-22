import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import DocumentVerification from "./DocumentVerification";
import Certificates from "./Certificates";
import Farmers from "./Farmers";
import ProfilePage from "../profile/ProfilePage";
import NotFound from "../NotFound";
import AdminProducts from "./AdminProducts";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/verify-documents" element={<DocumentVerification />} />
      <Route path="/certificates" element={<Certificates />} />
      <Route path="/users" element={<Farmers />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/products" element={<AdminProducts />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};

export default AdminRoutes;
