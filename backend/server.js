import express from 'express';
import dotenv from 'dotenv';
import connectMongoDB from './config/mongoDb.js';
import { authRoutes } from './routes/authRoutes.js';
import { documentRoutes } from './routes/documentRoutes.js';
import { certificateRoutes } from './routes/certificateRoutes.js';
import { profileRoutes } from './routes/profileRoutes.js';
import cors from "cors";
import mongoose from 'mongoose';
import { initGridFS } from './config/gridfsConfig.js';
import compression from 'compression';
import { productRoute } from './routes/productRoute.js';
import { adminRoutes } from './routes/adminRoutes.js';
import orderRoutes  from './routes/oderRoutes.js';

dotenv.config();
const app = express();

// Add compression middleware for all requests
app.use(compression());

// Set up middleware
app.use(cors({
  origin: "http://localhost:5173", // Allow frontend origin
  credentials: true, // Allow cookies (if needed)
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: "Invalid JSON format" }); // Handle JSON parsing errors
  }
  next();
});

// Optimize static file handling with appropriate cache headers
app.use(express.static('public', {
  maxAge: '1d', // Cache static assets for 1 day
  etag: true,
  lastModified: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/products', productRoute);
app.use('/api/admin', adminRoutes);
app.use('/api/order ', orderRoutes);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then((connection) => {
    console.log('Connected to MongoDB');
    
    // Initialize GridFS buckets with the database connection
    initGridFS(connection.connection.db);
    
    // Log collections for debugging
    connection.connection.db.listCollections().toArray((err, collections) => {
      if (err) {
        console.log('Error listing collections:', err);
        return;
      }
      console.log('MongoDB Collections:', collections.map(c => c.name));
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Start the server after MongoDB is connected
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
