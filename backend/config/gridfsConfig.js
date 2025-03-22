import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
import crypto from 'crypto';

let gridFSBucket;

// Initialize GridFS bucket
export const initGridFS = (db) => {
  try {
    gridFSBucket = new GridFSBucket(db, {
      bucketName: 'farmerDocuments'
    });
    console.log('GridFS bucket initialized with bucketName: farmerDocuments');
    return gridFSBucket;
  } catch (error) {
    console.error('Error initializing GridFS bucket:', error);
    throw error;
  }
};

// Get GridFS bucket
export const getGridFSBucket = () => {
  if (!gridFSBucket) {
    if (!mongoose.connection.db) {
      throw new Error('MongoDB connection not established. Cannot initialize GridFS.');
    }
    console.log('Creating new GridFS bucket');
    return initGridFS(mongoose.connection.db);
  }
  return gridFSBucket;
};

// Create a stream for uploading files to GridFS
export const createUploadStream = (filename, metadata) => {
  try {
    const bucket = getGridFSBucket();
    console.log(`Creating upload stream for file: ${filename}`);
    return bucket.openUploadStream(filename, {
      metadata: {
        ...metadata,
        uploadDate: new Date()
      }
    });
  } catch (error) {
    console.error('Error creating upload stream:', error);
    throw error;
  }
};

// Create a stream for downloading files from GridFS
export const createDownloadStream = (fileId) => {
  try {
    const bucket = getGridFSBucket();
    const objectId = new mongoose.Types.ObjectId(fileId);
    console.log(`Creating download stream for file ID: ${objectId}`);
    return bucket.openDownloadStream(objectId);
  } catch (error) {
    console.error('Error creating download stream:', error);
    throw error;
  }
};

// Delete a file from GridFS
export const deleteFile = (fileId) => {
  try {
    const bucket = getGridFSBucket();
    const objectId = new mongoose.Types.ObjectId(fileId);
    console.log(`Deleting file with ID: ${objectId}`);
    return bucket.delete(objectId);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Generate a hash from a file buffer
export const generateFileHash = (buffer) => {
  try {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  } catch (error) {
    console.error('Error generating file hash:', error);
    throw error;
  }
};
