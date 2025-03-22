import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import DocumentVerification from "./DocumentVerification";
import Certificates from "./Certificates";
import Farmers from "./Farmers";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/verify-documents" element={<DocumentVerification />} />
      <Route path="/certificates" element={<Certificates />} />
      <Route path="/users" element={<Farmers />} />
    </Routes>
  );
};

export default AdminRoutes;
