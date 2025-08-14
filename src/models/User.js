import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        // unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    // },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    });

    export default mongoose.model("User", userModel);