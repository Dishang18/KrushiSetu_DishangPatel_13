import express from 'express';
import { getUserProfile, updateUserProfile, getProfileById } from '../controllers/profileController.js';
import { uploadProfileImage, getProfileImage, deleteProfileImage } from '../controllers/uploadController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// User profile routes
router.get('/me', authenticate, getUserProfile);
router.put('/update', authenticate, updateUserProfile);
router.get('/user/:id', getProfileById);

// Profile image routes
router.post('/upload-profile-image', authenticate, uploadProfileImage);
router.get('/image/:id', getProfileImage);
router.delete('/delete-profile-image', authenticate, deleteProfileImage);

// Remove the base64 image endpoint since we no longer use base64 storage
// router.get('/image-base64', authenticate, getProfileImageBase64);

export const profileRoutes = router;