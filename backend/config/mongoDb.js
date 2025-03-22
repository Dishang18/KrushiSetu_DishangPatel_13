// config/mongoDB.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectMongoDB = async () => {
    try {
        console.log(process.env.MONGO_URL);
        await mongoose.connect(process.env.MONGO_URL, {
            // Removed deprecated options
        });
        console.log("MongoDB Connected Successfully!");
        return mongoose;
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

export default connectMongoDB;
