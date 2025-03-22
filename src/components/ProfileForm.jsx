// ...existing code...

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
    
    // Update the image URL with cache-busting query parameter
    if (data.fileId) {
      const newImageUrl = `/api/profile/image/${data.fileId}?v=${Date.now()}`;
      setProfileImageUrl(newImageUrl);
      
      // Create a comprehensive update for Redux with all existing user data
      const updatedUserData = {
        ...user,
        profileImage: data.fileId,
        // Ensure we're not storing any large base64 data
        profileImageBase64: undefined
      };
      
      // Dispatch the complete user object update to Redux
      dispatch({
        type: "user/updateUserData",
        payload: updatedUserData,
      });
      
      // Update our local copy of the user data
      if (originalProfile) {
        setOriginalProfile({
          ...originalProfile,
          profileImage: data.fileId
        });
      }
    }
  } catch (error) {
    // ...existing error handling code...
  } finally {
    setImageLoading(false);
  }
};

// Update the handleDeleteImage function to properly remove the image from Redux
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

    setProfileImageUrl(null);

    // Create a comprehensive update for Redux with all user data but no profile image
    const updatedUserData = {
      ...user,
      profileImage: null,
      profileImageBase64: undefined
    };
    
    // Update Redux with complete user object
    dispatch({
      type: "user/updateUserData",
      payload: updatedUserData,
    });
    
    // Update our local copy of the user data
    if (originalProfile) {
      setOriginalProfile({
        ...originalProfile,
        profileImage: null
      });
    }
  } catch (error) {
    // ...existing error handling code...
  } finally {
    setImageLoading(false);
  }
};

// Enhance the fetchUserProfile function to ensure profile image is properly stored
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

    // Set URL for profile image if one exists
    if (data.user.profileImage) {
      setProfileImageUrl(`/api/profile/image/${data.user.profileImage}?v=${Date.now()}`);
      setImageLoadError(false);
    } else {
      setProfileImageUrl(null);
    }

    // Store the complete user data in Redux, including profileImage
    if (data.user) {
      // Make sure we're explicitly including the profile image
      dispatch({
        type: "user/updateUserData",
        payload: {
          ...data.user,
          profileImage: data.user.profileImage || null
        }
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
    // ...existing error handling code...
  } finally {
    setLoading(false);
  }
};

// Also update initializeFromRedux to handle profile image consistently
const initializeFromRedux = () => {
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

  // Set profileImageUrl if available
  if (user.profileImage) {
    setProfileImageUrl(`/api/profile/image/${user.profileImage}?v=${Date.now()}`);
    setImageLoadError(false);
  } else {
    setProfileImageUrl(null);
  }

  setDataInitialized(true);
};

// ...existing code...
