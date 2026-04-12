import Course from "../models/course.model.js";
import { Purchase } from "../models/purchase.model.js";
import { v2 as cloudinary } from 'cloudinary';

export const createCourse =async (req,res) => {
    const adminId=req.adminId
    
     try {

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { title, description, price, youtubeLink } = req.body;
    console.log(title, description, price, youtubeLink);

    console.log(req.files);

    if (!title || !description || !price || !youtubeLink) {
      return res.status(400).json({ errors: "All fields are required" })
    }
       if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ errors: "No file uploaded" });
        }
        const image = req.files.image;
         if (!req.files?.image) {
        return res.status(400).json({
        success: false,
        message: "Image file is required", });
        }

        const allowedFormat=["image/png", "image/jpeg"]
        if(!allowedFormat.includes(image.mimetype)) {
            return res.status(400).json({ errors: "Invalid file format. Only PNG and JPG are allowed" });

        }

        const cloud_response=await cloudinary.uploader.upload(image.tempFilePath)
        if(!cloud_response || cloud_response.error){
            return res.status(400).json({errors: "Error uploading file to cloudinary" });
        }

        const courseData = {
          title,
          description,
          price,
          youtubeLink,
          image: {
            public_id: cloud_response.public_id,
            url: cloud_response.url,
          },
          creatorId: adminId
        }
        const course = await Course.create(courseData)
        res.json({
            message: "Course created successfully",
            course
        })
    } catch(error) {
        console.log(error)
        res.status(500).json({error: "Error creating course" });
    }  
   
};

export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price, youtubeLink } = req.body;
  try {
    const courseSearch = await Course.findById(courseId);
    if (!courseSearch) {
      return res.status(404).json({ errors: "Course not found" });
    }

    let imageUpdate = courseSearch.image; // default to old image

    if (req.files && req.files.image) {
      const file = req.files.image;
      const cloud_response = await cloudinary.uploader.upload(file.tempFilePath);
      if (!cloud_response || cloud_response.error) {
        return res.status(400).json({ errors: "Error uploading new image" });
      }
      imageUpdate = {
        public_id: cloud_response.public_id,
        url: cloud_response.url,
      };
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      {
        title,
        description,
        price,
        image: imageUpdate,
        youtubeLink,
      },
      { new: true }
    );
    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ errors: "Error in course updating" });
    console.log("Error in course updating ", error);
  }
};

export const deleteCourse=async(req,res) => {
    const adminId=req.adminId
    const {courseId}=req.params;
    try {
        const course=await Course.findOneAndDelete({
            _id:courseId,
            creatorId: adminId,
        });
        if(!course){
            return res.status(404).json({error:"Course not found"})
        }
        res.status(200).json({message:"Course deleted successfully"})
    } catch (error) {
        res.status(200).json({errors:"Error in course deleting"})
            console.log("Error in course deleting", error);
    }
};

export const getCourses = async (req, res) => {
    try {
        const courses=await Course.find({})
        res.status(201).json({ courses });
    } catch (error) {
        res.status(500).json({ errors: "Error in getting courses" });
        console.log("error to get courses", error);
    }
};

export const courseDetails = async (req, res) => {
    const { courseId } = req.params;
    try{
        const course = await Course.findById(courseId);
        if(!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.status(200).json({ course });
    } catch (error) {
         console.log("ERROR:", error);
      res.status(500).json({ errors: "Error in getting course details" });
      console.log("Error in course details", error);
    }
};

import Stripe from "stripe"
import config from "../config.js";
const stripe=new Stripe(config.STRIPE_SECRET_KEY);
console.log(config.STRIPE_SECRET_KEY);

export const buyCourses = async (req, res) => {
   
    const {userId} = req;
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId);
        if(!course) {
            return res.status(404).json({ errors: "Course not found" });
         }
         const existingPurchase = await Purchase.findOne({ userId, courseId });
         if (existingPurchase) {
            return res
            .status(400)
            .json({ errors: "User has already purchased this course" });
         }

         /* stripe payment code goes here!!*/

         const amount=course.price;

    const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types:["card"]
    },
  );
         

         res
         .status(201)
         .json({ message: "Course purchased successfully", 
            course,
             clientSecret: paymentIntent.client_secret

         });
    } catch (error) {
        res.status(500).json({ errors: "Error in course buying" });
        console.log("error in course buying ", error);
    }
};
