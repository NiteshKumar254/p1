import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,         
    },

    hotelLocation: {
        type: String,               
        required: true,
    },

    description: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.ObjectId,
        ref: "Category",
        required: true,
    },  

    images: {
        type: [String], // Array of image URLs
        required: true, // Default to an empty array if no images are provided
        validate: [arrayLimit , 'You must provide at least 3 images.'],

    },
    isAvailable: {
        type: Boolean,
        default: true, // Default to true if not specified
        required: true,
    },

    guest: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min:100, 
        max:5000,
    },
    newArea: {
        type: [String],
        required: true,
    },   
    facilities: {
        type: [String], 
        required: true,
    },

    
    slug: {
        type: String,
        lowercase: true,
    },

});

// function arrayLimit(val) {
//     return val.length === 3; 
// }

function arrayLimit(val) {
    return val.length >= 3; 
}
 export default mongoose.model("Post", postSchema);
   