import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Phone,
  FileText,
  Upload,
  Camera,
  Trash2,
  Edit,
  Save,
  X,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import PincodeInfoModal from "./PincodeInfoModal";
import axiosInstance from "../context/axiosInstance";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

// Define API base URL - keep this for the external pincode API
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const ProfileForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    phoneNumber: "",
    pincode: "",
    address: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [profileImageBlob, setProfileImageBlob] = useState(null); // Store the blob URL
  const [locationInfo, setLocationInfo] = useState(null);
  const [dataInitialized, setDataInitialized] = useState(false);
  const [showPincodeInfo, setShowPincodeInfo] = useState(false);
  const [pincodeData, setPincodeData] = useState(null);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [originalProfile, setOriginalProfile] = useState(null);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true); // Add this state for image loading specifically for the LazyLoadImage component

  // Function to get the authentication token
  const getAuthToken = () => {
    // Try to get token from cookies first (more secure)
    const cookieToken = Cookies.get("token");
    if (cookieToken) return cookieToken;

    // Fall back to localStorage if not in cookies
    return localStorage.getItem("token");
  };

  // Clean up blob URLs when component unmounts
  useEffect(() => {
    return () => {
      // Revoke any blob URLs to prevent memory leaks
      if (profileImageBlob) {
        URL.revokeObjectURL(profileImageBlob);
      }
    };
  }, []);

  useEffect(() => {
    // If we have complete user data in Redux, use it
    if (user && user.name && !dataInitialized) {
      initializeFromRedux();
    } else if (!dataInitialized) {
      // Otherwise fetch from API
      fetchUserProfile();
    }
  }, [user]);

  // Function to fetch profile image and create a blob URL
  const fetchProfileImage = async () => {
    try {
      setIsImageLoading(true); // Start loading state

      const response = await axiosInstance.get(`/profile/image/${user?.profileImage}`, {
        responseType: "blob",
      });
      
      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }
      
      // Revoke previous blob URL if it exists
      if (profileImageBlob) {
        URL.revokeObjectURL(profileImageBlob);
      }
      
      // Create a new blob URL
      const blobUrl = URL.createObjectURL(response.data);
      
      // Save the blob URL
      setProfileImageBlob(blobUrl);
      setProfileImageUrl(blobUrl);
      setImageLoadError(false);
      
      return blobUrl;
    } catch (error) {
      console.error("Error fetching profile image:", error);
      setImageLoadError(true);
      return null;
    }
  };

  const initializeFromRedux = async () => {
    if (!user) return;

    const profileData = {
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
      phoneNumber: user.phoneNumber || "",
      pincode: user.pincode || "",
      address: user.address || "",
      bio: user.bio || "",
    };

    setProfile(profileData);
    setOriginalProfile(profileData);

    setLocationInfo(user.location || null);

    // Set profileImageUrl if available by fetching the actual image data
    if (user.profileImage) {
      try {
        // Fetch the profile image and create a blob URL
        const blobUrl = await fetchProfileImage();
        
        // Update Redux with the full user data including the image URL
        if (blobUrl) {
          dispatch({
            type: "user/updateUserData",
            payload: {
              ...user,
              profileImageUrl: blobUrl
            },
          });
        }
      } catch (error) {
        console.error("Error initializing profile image:", error);
        setImageLoadError(true);
      }
    }

    setDataInitialized(true);
  };

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const toastId = toast.loading("Loading profile...");

      const { data } = await axiosInstance.get("/profile/me");

      const profileData = {
        name: data.user.name || "",
        email: data.user.email || "",
        role: data.user.role || "",
        phoneNumber: data.user.phoneNumber || "",
        pincode: data.user.pincode || "",
        address: data.user.address || "",
        bio: data.user.bio || "",
      };

      setProfile(profileData);
      setOriginalProfile(profileData);

      setLocationInfo(data.user.location || null);

      // Set URL for profile image if one exists by fetching the actual image
      if (data.user.profileImage) {
        try {
          // Fetch the profile image and create a blob URL
          const blobUrl = await fetchProfileImage();
          
          // Update the full user data to include the image URL in Redux
          if (blobUrl && data.user) {
            data.user.profileImageUrl = blobUrl;
          }
        } catch (error) {
          console.error("Error fetching profile image:", error);
          setImageLoadError(true);
        }
      }

      // Store the complete user data in Redux
      if (data.user) {
        dispatch({
          type: "user/updateUserData",
          payload: data.user,
        });
      }

      setDataInitialized(true);
      toast.update(toastId, {
        render: "Profile loaded successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 401) {
        toast.error("Your session has expired. Please login again.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const fetchPincodeInfo = async () => {
    if (!profile.pincode || profile.pincode.length !== 6) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }

    const toastId = toast.loading("Fetching location data...");

    try {
      // Using regular fetch for external API calls is fine
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${profile.pincode}`
      );
      const data = await response.json();

      if (
        data[0].Status === "Success" &&
        data[0].PostOffice &&
        data[0].PostOffice.length > 0
      ) {
        const locationData = data[0].PostOffice[0];

        // Show details of what we're fetching from pincode API
        console.log("Pincode data retrieved:", locationData);

        const newLocationInfo = {
          country: "India",
          state: locationData.State,
          district: locationData.District,
          block: locationData.Block || "",
          village: locationData.Name,
        };

        setLocationInfo(newLocationInfo);

        // Set data for modal
        setPincodeData({
          pincode: profile.pincode,
          state: locationData.State,
          district: locationData.District,
          block: locationData.Block || "",
          village: locationData.Name,
        });

        // Show the modal with pincode info
        setShowPincodeInfo(true);

        toast.update(toastId, {
          render: "Location information updated",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.update(toastId, {
          render: "Invalid pincode. Please enter a valid Indian pincode",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error fetching pincode data:", error);
      toast.update(toastId, {
        render: "Failed to fetch location information",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!profile.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!profile.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(profile.phoneNumber.trim())) {
      newErrors.phoneNumber = "Enter a valid 10-digit phone number";
    }

    if (!profile.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(profile.pincode.trim())) {
      newErrors.pincode = "Enter a valid 6-digit pincode";
    }

    if (!profile.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating profile...");

    try {
      const updatedProfile = { ...profile };
      if (locationInfo) {
        updatedProfile.location = locationInfo;
      }

      const { data } = await axiosInstance.put(
        "/profile/update",
        updatedProfile
      );

      // Update profile with response data
      const updatedProfileData = {
        ...profile,
        ...(data.user || {}),
      };

      setProfile(updatedProfileData);
      setOriginalProfile(updatedProfileData);

      if (data.user?.location) {
        setLocationInfo(data.user.location);
      }

      toast.update(toastId, {
        render: "Profile updated successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Update redux state if available
      if (dispatch && data.user) {
        dispatch({
          type: "user/updateUserData",
          payload: data.user,
        });
      }

      // Exit edit mode after successful update
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);

      // Handle 401 specifically
      if (error.response?.status === 401) {
        toast.update(toastId, {
          render: "Your session has expired. Please login again.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        navigate("/login");
        return;
      }

      toast.update(toastId, {
        render: error.response?.data?.message || "Failed to update profile",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Add image size check and optimization hint
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image file should be less than 2MB for fast loading");
      return;
    }

    setImageLoading(true);
    const toastId = toast.loading("Uploading profile image...");

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append("profileImage", file);

      // Upload with axios
      const { data } = await axiosInstance.post(
        "/profile/upload-profile-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.update(toastId, {
        render: "Profile image updated successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Reset image load error when setting new image
      setImageLoadError(false);
      
      // After successful upload, fetch the new image as a blob
      if (data.fileId) {
        // Fetch the updated image with the new ID
        const blobUrl = await fetchProfileImage();
        
        // Update Redux with complete user information including image
        dispatch({
          type: "user/updateUserData",
          payload: { 
            ...user, 
            profileImage: data.fileId,
            profileImageUrl: blobUrl
          },
        });
        
        // Update local state
        if (originalProfile) {
          setOriginalProfile({
            ...originalProfile,
            profileImage: data.fileId,
            profileImageUrl: blobUrl
          });
        }
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);

      // Handle 401 specifically
      if (error.response?.status === 401) {
        toast.update(toastId, {
          render: "Your session has expired. Please login again.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        navigate("/login");
        return;
      }

      toast.update(toastId, {
        render: error.response?.data?.message || "Failed to upload image",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setImageLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!profileImageUrl) return;

    if (!confirm("Are you sure you want to delete your profile image?")) {
      return;
    }

    setImageLoading(true);
    const toastId = toast.loading("Removing profile image...");

    try {
      const { data } = await axiosInstance.delete(
        "/profile/delete-profile-image"
      );

      toast.update(toastId, {
        render: "Profile image removed successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Clean up blob URL if it exists
      if (profileImageBlob) {
        URL.revokeObjectURL(profileImageBlob);
        setProfileImageBlob(null);
      }
      
      setProfileImageUrl(null);

      // Update Redux by removing profile image
      dispatch({
        type: "user/updateUserData",
        payload: { 
          ...user, 
          profileImage: null,
          profileImageUrl: null,
          profileImageBase64: undefined
        },
      });
      
      // Update local state
      if (originalProfile) {
        setOriginalProfile({
          ...originalProfile,
          profileImage: null,
          profileImageUrl: null
        });
      }
    } catch (error) {
      console.error("Error deleting profile image:", error);

      // Handle 401 specifically
      if (error.response?.status === 401) {
        toast.update(toastId, {
          render: "Your session has expired. Please login again.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        navigate("/login");
        return;
      }

      toast.update(toastId, {
        render: error.response?.data?.message || "Failed to delete image",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setImageLoading(false);
    }
  };

  const toggleEditMode = () => {
    if (editMode && originalProfile) {
      // If canceling edit, revert to original profile data
      setProfile(originalProfile);
      setErrors({});
    }
    setEditMode(!editMode);
  };

  // Handle image load error
  const handleImageError = () => {
    console.error("Failed to load profile image");
    setImageLoadError(true);
  };

  // Add handler for when the image successfully loads
  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  // Show loading state if data is not initialized
  if (!dataInitialized && loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="animate-spin h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-white text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mt-6 p-6 bg-gradient-to-br from-[#2d4f47] to-[#1a332e] rounded-xl shadow-xl border border-teal-500/20"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <User className="mr-2 text-teal-400" size={28} />
            {editMode ? "Edit Profile" : "Your Profile"}
          </h2>

          <button
            onClick={toggleEditMode}
            className={`px-4 py-2 rounded-lg flex items-center transition-colors ${
              editMode
                ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                : "bg-teal-500/20 text-teal-300 hover:bg-teal-500/30"
            }`}
          >
            {editMode ? (
              <>
                <X size={18} className="mr-1" /> Cancel
              </>
            ) : (
              <>
                <Edit size={18} className="mr-1" /> Edit Profile
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Image Section */}
          <div className="col-span-1 flex flex-col items-center">
            <div className="relative w-48 h-48 mb-6 group">
              {/* Image container - always maintain the same dimensions */}
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-teal-500/50 shadow-lg relative">
                {/* Loading indicator - shown when image is loading or when upload is happening */}
                {(imageLoading || isImageLoading) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#1a332e]/70 z-10">
                    <div className="animate-spin h-10 w-10 border-3 border-teal-400 border-t-transparent rounded-full"></div>
                  </div>
                )}

                {profileImageUrl && !imageLoadError ? (
                  // Image with proper handling of loading state
                  <LazyLoadImage
                    src={profileImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    effect="opacity" // Simple fade-in effect
                    threshold={100}
                    beforeLoad={() => setIsImageLoading(true)}
                    afterLoad={handleImageLoad}
                    onError={handleImageError}
                    wrapperClassName="w-full h-full"
                  />
                ) : (
                  // Default placeholder that maintains the circle dimensions
                  <div className="w-full h-full bg-gradient-to-br from-[#1a332e] to-[#15292a] flex items-center justify-center">
                    <User size={64} className="text-teal-400" />
                  </div>
                )}
              </div>

              {/* Image controls (no change needed) */}
              {!imageLoading && (
                <div
                  className={`absolute bottom-2 right-2 flex space-x-2 transition-opacity ${
                    editMode
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <label
                    htmlFor="profile-image-upload"
                    className="cursor-pointer p-2 bg-teal-500 rounded-full text-white hover:bg-teal-600 transition shadow-lg"
                  >
                    <Camera size={20} />
                    <input
                      type="file"
                      id="profile-image-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>

                  {profileImageUrl && (
                    <button
                      onClick={handleDeleteImage}
                      className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition shadow-lg"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="bg-[#1a332e]/80 p-5 rounded-lg w-full shadow-md border border-teal-500/10">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <User className="mr-2 text-teal-400" size={18} />
                Account Info
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-teal-300 mb-1">EMAIL ADDRESS</p>
                  <p className="text-white font-medium">{profile.email}</p>
                </div>
                <div>
                  <p className="text-xs text-teal-300 mb-1">ACCOUNT TYPE</p>
                  <span className="inline-block px-3 py-1 bg-teal-500/20 rounded-full text-sm font-medium text-teal-300">
                    {profile.role === "consumer"
                      ? "Consumer"
                      : profile.role === "farmer"
                      ? "Farmer"
                      : "Admin"}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-teal-300 mb-1">MEMBER SINCE</p>
                  <p className="text-white font-medium">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {locationInfo && (
              <div className="bg-[#1a332e]/80 p-5 rounded-lg w-full mt-4 shadow-md border border-teal-500/10">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <MapPin className="mr-2 text-teal-400" size={18} />
                  Location Details
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-teal-300 mb-1">STATE</p>
                    <p className="text-white">{locationInfo.state || "N/A"}</p>
                  </div>

                  <div>
                    <p className="text-xs text-teal-300 mb-1">DISTRICT</p>
                    <p className="text-white">
                      {locationInfo.district || "N/A"}
                    </p>
                  </div>

                  {locationInfo.block && (
                    <div>
                      <p className="text-xs text-teal-300 mb-1">BLOCK</p>
                      <p className="text-white">{locationInfo.block}</p>
                    </div>
                  )}

                  {locationInfo.village && (
                    <div>
                      <p className="text-xs text-teal-300 mb-1">VILLAGE/AREA</p>
                      <p className="text-white">{locationInfo.village}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Form Section */}
          <div className="col-span-2">
            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Input */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-teal-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className={`bg-[#1a332e] text-white w-full pl-10 pr-3 py-3 rounded-lg border ${
                        errors.name
                          ? "border-red-500 focus:border-red-500"
                          : "border-teal-500/20 focus:border-teal-500"
                      } focus:outline-none transition-colors`}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Phone Number Input */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-teal-400" />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={profile.phoneNumber}
                      onChange={handleChange}
                      className={`bg-[#1a332e] text-white w-full pl-10 pr-3 py-3 rounded-lg border ${
                        errors.phoneNumber
                          ? "border-red-500 focus:border-red-500"
                          : "border-teal-500/20 focus:border-teal-500"
                      } focus:outline-none transition-colors`}
                      placeholder="9876543210"
                      required
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Pincode Input with Verify Button */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Pincode <span className="text-red-400">*</span>
                  </label>
                  <div className="relative flex">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-teal-400" />
                    </div>
                    <input
                      type="text"
                      name="pincode"
                      value={profile.pincode}
                      onChange={handleChange}
                      className={`bg-[#1a332e] text-white w-full pl-10 pr-3 py-3 rounded-lg border ${
                        errors.pincode
                          ? "border-red-500 focus:border-red-500"
                          : "border-teal-500/20 focus:border-teal-500"
                      } focus:outline-none transition-colors`}
                      placeholder="123456"
                      maxLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={fetchPincodeInfo}
                      className="ml-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition shadow-sm flex items-center"
                    >
                      <MapPin size={16} className="mr-1" /> Verify
                    </button>
                  </div>
                  {errors.pincode && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.pincode}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Enter your 6-digit pincode and click Verify to fetch
                    location details
                  </p>
                </div>

                {/* Address Input */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Address <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                    rows="2"
                    className={`bg-[#1a332e] text-white w-full p-3 rounded-lg border ${
                      errors.address
                        ? "border-red-500 focus:border-red-500"
                        : "border-teal-500/20 focus:border-teal-500"
                    } focus:outline-none transition-colors`}
                    placeholder="Your address"
                    required
                  ></textarea>
                  {errors.address && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* Bio Input */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Bio
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <FileText className="h-5 w-5 text-teal-400" />
                    </div>
                    <textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      rows="4"
                      className="bg-[#1a332e] text-white w-full pl-10 pr-3 py-2 rounded-lg border border-teal-500/20 focus:outline-none focus:border-teal-500 transition-colors"
                      placeholder="Tell us about yourself"
                      maxLength={500}
                    ></textarea>
                  </div>
                  <p className="text-xs text-right text-gray-400 mt-1">
                    {profile.bio ? profile.bio.length : 0}/500 characters
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center py-3 px-4 rounded-lg transition-colors ${
                    loading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-teal-500 hover:bg-teal-600"
                  } text-white font-medium mt-6 shadow-lg`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Updating...
                    </span>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              // View mode - display profile information
              <div className="bg-[#1a332e]/80 rounded-lg p-6 shadow-md border border-teal-500/10">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <User className="mr-2 text-teal-400" size={18} />
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-xs text-teal-300">FULL NAME</p>
                        <p className="text-white text-lg font-medium">
                          {profile.name || "Not provided"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-teal-300">PHONE NUMBER</p>
                        <p className="text-white text-lg font-medium">
                          {profile.phoneNumber || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-teal-500/10">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <MapPin className="mr-2 text-teal-400" size={18} />
                      Address Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-xs text-teal-300">PINCODE</p>
                        <p className="text-white text-lg font-medium">
                          {profile.pincode || "Not provided"}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-teal-300">ADDRESS</p>
                        <p className="text-white">
                          {profile.address || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {profile.bio && (
                    <div className="pt-4 border-t border-teal-500/10">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <FileText className="mr-2 text-teal-400" size={18} />
                        Bio
                      </h3>
                      <p className="text-white leading-relaxed">
                        {profile.bio}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Pincode Info Modal */}
      <PincodeInfoModal
        isOpen={showPincodeInfo}
        onClose={() => setShowPincodeInfo(false)}
        locationData={pincodeData}
      />
    </>
  );
};

export default ProfileForm;
