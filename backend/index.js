import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import cors from "cors";
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { v2 as cloudinary } from 'cloudinary';

// Routes
import courseRoute from "./routes/course.routes.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import orderRoute from "./routes/order.route.js";

const app = express();
dotenv.config();

// Body parser
app.use(express.json());

//  CORS FIXED 
app.use(cors({
  origin: "http://localhost:5173",   
  credentials: true
}));

//  Cookie parser
app.use(cookieParser());

//  File upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: './tmp/',
  })
);

//  Database connection
const port = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI;

try {
  await mongoose.connect(DB_URI);
  console.log("Connected to MongoDB");
} catch (error) {
  console.log("DB Error:", error);
}

//  Routes
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderRoute);

//  Cloudinary config
cloudinary.config({ 
  cloud_name: process.env.cloud_name, 
  api_key: process.env.api_key, 
  api_secret: process.env.api_secret,
});

//  Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});