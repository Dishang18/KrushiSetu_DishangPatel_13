import express from 'express';
import dotenv from 'dotenv';
import connectMongoDB from './config/mongoDb.js';
import { authRoutes } from './routes/authRoutes.js';
import { documentRoutes } from './routes/documentRoutes.js';
import { certificateRoutes } from './routes/certificateRoutes.js';
import cors from "cors";
import mongoose from 'mongoose';

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:5173", // Allow frontend origin
  credentials: true, // Allow cookies (if needed)
}));

app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: "Invalid JSON format" }); // Handle JSON parsing errors
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/certificates', certificateRoutes);

// Connect MongoDB
connectMongoDB()
  .then(() => {
    // Initialize GridFS after MongoDB connection is established
    // We can access mongoose.connection directly after successful connection
    import('./config/gridfsConfig.js').then(({ initGridFS }) => {
      try {
        console.log('Initializing GridFS with database connection');
        const db = mongoose.connection.db;
        if (!db) {
          console.error('MongoDB connection exists but db object is undefined');
        } else {
          initGridFS(db);
          console.log('GridFS initialized successfully');
        }
      } catch (error) {
        console.error('Failed to initialize GridFS:', error);
      }
    }).catch(err => {
      console.error('Error importing gridfsConfig:', err);
    });
    
    // Start the server after MongoDB is connected
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });
