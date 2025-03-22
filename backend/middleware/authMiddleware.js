import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Middleware to authenticate JWT tokens
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header or query parameter
    const token = 
      req.headers.authorization?.split(' ')[1] || 
      req.query.token || 
      null;

    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user by id
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      // Add user to request object
      req.user = {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      };

      console.log("authenticated " + user.role)
      next();
    } catch (error) {
      console.error('JWT verification error:', error);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({ message: 'Server error in authentication' });
  }
};

// Middleware to restrict routes based on user role
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'You do not have permission to perform this action' 
      });
    }
    
    next();
  };
};
