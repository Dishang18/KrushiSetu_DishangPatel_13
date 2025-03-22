import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
// import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/RegisterPage';
import Home from './pages/Home';

import About from './pages/About';
import Marketplace from './pages/Marketplace';
import Farmers from './pages/Farmers';
import AdminMain from './pages/Admin/AdminRoute';
import FarmerMain from './pages/Farmers/FarmerRoutes';
import ConsumerMain from './pages/Consumers/ConsumerRoutes';

import React from 'react';  
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/farmers" element={<Farmers />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/*" element={<AdminMain />} />
            <Route path="/farmer/*" element={<FarmerMain />} />
            <Route path="/consumer/*" element={<ConsumerMain />} />
                        
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;