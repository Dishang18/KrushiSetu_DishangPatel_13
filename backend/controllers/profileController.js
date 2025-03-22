import User from '../models/userModel.js';
import axios from 'axios';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('-password -refreshToken');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phoneNumber, pincode, address, bio } = req.body;
    
    // Find the user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Update user details
    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (bio) user.bio = bio;
    
    // If pincode is provided and different from current pincode, fetch and update location data
    if (pincode && pincode !== user.pincode) {
      user.pincode = pincode;
      
      try {
        // Fetch location data from India Post Pincode API
        const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        
        if (response.data && response.data[0].Status === 'Success' && response.data[0].PostOffice) {
          const locationData = response.data[0].PostOffice[0];
          
          user.location = {
            country: 'India',
            state: locationData.State || user.location.state,
            district: locationData.District || user.location.district,
            block: locationData.Block || user.location.block,
            village: locationData.Name || user.location.village
          };
        }
      } catch (error) {
        console.error('Error fetching pincode data:', error);
        // Continue with update even if pincode data fetch fails
      }
    }
    
    // Save the updated user
    await user.save();
    
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        pincode: user.pincode,
        location: user.location,
        address: user.address,
        bio: user.bio,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get profile by ID (for public view, with limited data)
export const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('name role bio profileImage location');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    return res.status(200).json({
      success: true,
      profile: user
    });
  } catch (error) {
    console.error('Error fetching user profile by ID:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}; 