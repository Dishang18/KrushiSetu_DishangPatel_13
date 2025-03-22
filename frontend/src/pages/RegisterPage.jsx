import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithGoogle } from "../firebase";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus, Mail, Lock, User, AlertCircle } from "lucide-react";
import { showError, showSuccess, showLoading, updateLoadingToast } from "../components/Notification";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess } from "../redux/slices/userSlice";
import { setTokenCookie, setRefreshTokenCookie } from "../utils/cookies";
import useAuth from "../hooks/useAuth";
import { useAlerts } from "../components/AlertMessage";

// Define API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("consumer");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getHomeRoute } = useAuth();
  const { showError: showAlertError } = useAlerts();

  const validateForm = () => {
    // Email validation
    if (!email) {
      showError("Please enter your email");
      return false;
    }
    
    // Password validation
    if (!password) {
      showError("Please enter a password");
      return false;
    }
    
    if (password.length < 6) {
      showError("Password must be at least 6 characters");
      return false;
    }
    
    // Password match validation
    if (password !== confirmPassword) {
      showError("Passwords don't match");
      return false;
    }
    
    // Terms agreement
    if (!agreed) {
      showError("Please agree to the Terms of Service and Privacy Policy");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Show loading toast
    const toastId = showLoading("Creating your account...");
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          agreed
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      
      updateLoadingToast(toastId, "success", "Registration successful! Please log in.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      
      if (error.message === "User already exists") {
        updateLoadingToast(toastId, "error", "This email is already registered. Please log in instead.");
      } else if (error.message.includes("network") || error.name === "TypeError") {
        // Network error - show more visible alert
        updateLoadingToast(toastId, "error", "Connection error");
        showAlertError("Unable to connect to the server. Please check your internet connection and try again.", 10000);
      } else {
        updateLoadingToast(toastId, "error", error.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!agreed) {
      showError("Please agree to the Terms of Service and Privacy Policy");
      return;
    }
    
    setLoading(true);
    dispatch(loginStart());
    
    // Show loading toast
    const toastId = showLoading("Signing in with Google...");
    
    try {
      const result = await signInWithGoogle();
      const idToken = await result.user.getIdToken();
      
      const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          idToken,
          role,
          agreed
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Google registration failed");
      }
      
      // Store token in cookies
      setTokenCookie(data.token || idToken);
      if (data.refreshToken) {
        setRefreshTokenCookie(data.refreshToken);
      }
      
      // Store user data in Redux
      dispatch(loginSuccess(data.user));
      
      // Handle successful registration
      if (data.isExistingUser) {
        updateLoadingToast(toastId, "success", "Welcome back! Logging you in...");
      } else {
        updateLoadingToast(toastId, "success", "Account created successfully!");
      }
      
      // Redirect based on role using getHomeRoute
      setTimeout(() => {
        navigate(getHomeRoute());
      }, 1500);
    } catch (error) {
      console.error("Google sign-in error:", error);
      
      if (error.message.includes("network") || error.name === "TypeError") {
        // Network error - show more visible alert
        updateLoadingToast(toastId, "error", "Connection error");
        showAlertError("Unable to connect to the server. Please check your internet connection and try again.", 10000);
      } else {
        updateLoadingToast(toastId, "error", error.message || "Registration with Google failed");
      }
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
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Register</h2>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-teal-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#1a332e] text-white w-full pl-10 pr-3 py-2 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              
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
              
              {/* Confirm Password Input */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-teal-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-[#1a332e] text-white w-full pl-10 pr-3 py-2 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              {/* Role Selection */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Register as</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setRole("consumer")}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      role === "consumer"
                        ? "bg-teal-500 text-white"
                        : "bg-[#1a332e] text-white border border-teal-500/20 hover:bg-[#243e39]"
                    }`}
                  >
                    Consumer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("farmer")}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      role === "farmer"
                        ? "bg-teal-500 text-white"
                        : "bg-[#1a332e] text-white border border-teal-500/20 hover:bg-[#243e39]"
                    }`}
                  >
                    Farmer
                  </button>
                </div>
              </div>
              
              {/* Terms Agreement */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agree"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 bg-[#1a332e] border border-teal-500/20 rounded focus:ring-0 focus:ring-offset-0"
                  />
                </div>
                <label htmlFor="agree" className="ml-2 text-sm text-gray-300">
                  I agree to the{" "}
                  <Link to="/terms" className="text-teal-400 hover:text-teal-300">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-teal-400 hover:text-teal-300">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              
              {/* Register Button */}
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
                  <span>Registering...</span>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5 mr-2" />
                    <span>Register</span>
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
              Register with Google
            </button>
            
            {/* Login Link */}
            <p className="mt-6 text-center text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-teal-400 hover:text-teal-300">
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;