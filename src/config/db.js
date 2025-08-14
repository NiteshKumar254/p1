import mongoose from "mongoose";

export const connectToDb = async () => {
    const uri= process.env.MONGODB_URI;
    try {
        await mongoose.connect(uri);
        console.log("Mongodb has been connected successfully");
    }  catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with failure

    }

    mongoose.connection.on("error", (err) => {
        // console.error("MongoDB connection error:", err);
        console.log("MongoDB connection error:", err.message);
    });
}; 

