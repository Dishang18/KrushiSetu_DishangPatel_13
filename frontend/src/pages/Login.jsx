import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithGoogle } from "../firebase";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";

// Define API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form fields
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    
    if (!password) {
      toast.error("Please enter your password");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          password 
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      
      // Store token and user info
      localStorage.setItem("token", data.token);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Show success message
      toast.success("Login successful!");
      
      // Log activity
      console.log("User logged in:", data.user.email);
      
      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin/");
      } else if (data.user.role === "farmer") {
        navigate("/farmer/dashboard");
      } else {
        navigate("/consumer/");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.message === "Invalid credentials") {
        toast.error("Invalid email or password");
      } else {
        toast.error(error.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      const idToken = await result.user.getIdToken();
      
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Google authentication failed");
      }
      
      // Store token and user info
      localStorage.setItem("token", data.token || idToken);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Show success message
      toast.success("Login with Google successful!");
      
      // Log activity
      console.log("User logged in with Google:", data.user.email);
      
      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else if (data.user.role === "farmer") {
        navigate("/farmer/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error(error.message || "Failed to login with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a332e]">
      <Navbar />
      <div className="pt-24 px-6 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-[#2d4f47] rounded-xl p-8 shadow-lg border border-teal-500/20">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-teal-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-[#1a332e] text-white w-full pl-10 pr-3 py-2 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              {/* Password Input */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-teal-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-[#1a332e] text-white w-full pl-10 pr-10 py-2 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-teal-400 hover:text-teal-300 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-teal-400 hover:text-teal-300">
                  Forgot password?
                </Link>
              </div>
              
              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-3 px-4 rounded-lg transition-colors ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-teal-500 hover:bg-teal-600"
                } text-white font-medium mt-6`}
              >
                {loading ? (
                  <span>Logging in...</span>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    <span>Login</span>
                  </>
                )}
              </button>
            </form>
            
            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-teal-500/20"></div>
              <span className="mx-4 text-gray-400">or</span>
              <div className="flex-grow border-t border-teal-500/20"></div>
            </div>
            
            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 rounded-lg border border-teal-500/20 bg-[#1a332e] text-white hover:bg-[#243e39] transition-colors"
            >
              <img src="/google-icon.svg" alt="Google" className="h-5 w-5 mr-2" />
              Login with Google
            </button>
            
            {/* Register Link */}
            <p className="mt-6 text-center text-gray-400">
              Don't have an account yet?{" "}
              <Link to="/register" className="text-teal-400 hover:text-teal-300">
                Register
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;