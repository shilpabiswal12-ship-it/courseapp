import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    image: {
        public_id: {
             type: String,
        required: true,
        },
        url: {
            type: String,
            required: true,
        },
       
    },
    youtubeLink: {
        type: String,
        required: true,
    },
    creatorId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
});

export default mongoose.model("Course", courseSchema);