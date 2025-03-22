import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider } from './context/authContext';
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRedirect from "./components/RoleBasedRedirect";
import Login from "./pages/Login";
import Register from "./pages/RegisterPage";
import Home from "./pages/Home";
import About from "./pages/About";
import Marketplace from "./pages/Marketplace";
import Farmers from "./pages/Farmers";
import AdminMain from "./pages/Admin/AdminRoute";
import FarmerMain from "./pages/Farmers/FarmerRoutes";
import ConsumerMain from "./pages/Consumers/ConsumerRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { AlertProvider } from "./components/AlertMessage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AlertProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            {/* Home route with automatic redirection based on role */}
            <Route
              path="/"
              element={
                <>
                  <RoleBasedRedirect />
                  <Home />
                </>
              }
            />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/farmers" element={<Farmers />} />
            <Route path="/about" element={<About />} />
            <Route path="/*" element={<NotFound />} />

            <Route
              path="/login"
              element={
                <>
                  <RoleBasedRedirect />
                  <Login />
                </>
              }
            />

            <Route
              path="/register"
              element={
                <>
                  <RoleBasedRedirect />
                  <Register />
                </>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminMain />
                </ProtectedRoute>
              }
            />

            <Route
              path="/farmer/*"
              element={
                <ProtectedRoute requiredRole="farmer">
                  <FarmerMain />
                </ProtectedRoute>
              }
            />

            <Route
              path="/consumer/*"
              element={
                <ProtectedRoute requiredRole="consumer">
                  <ConsumerMain />
                </ProtectedRoute>
              }
            />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastClassName="bg-[#1a332e] border border-teal-500/30 shadow-lg text-white rounded-lg"
            progressClassName="bg-teal-500"
          />
        </div>
      </Router>
    </AlertProvider>
  );
}

export default App;
