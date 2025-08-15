
   import cloudinary from "../config/Cloudinary.js";
   import Post from "../models/Post.js";
   import slug from "slugify";
   export const createPostController = async (req, res) => {
  try {
    const {
      title,
      hotelLocation,
      description,
      category,
    //   images,
      isAvailable,
       guest,
       price,
        nearArea,
      facilities,
    } = req.body;
    const files = req.files?.images;
    //validation 

    if (
        // !title || !hotelLocation || !description || !category || !images ||
        // !guest || !isAvailable || !price || !nearArea || !facilities

         !title || !hotelLocation || !description || !files ||
        !guest || !isAvailable || !price || !nearArea || !facilities || !category
      
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!files || files.length !== 3) {
      return res
        .status(400).json({ 
            message: "Please upload exactly 3 images." 
        });
    }

     // Upload images to Cloudinary
    const imageUrls = await Promise.all(
      files.map((file) =>
        cloudinary.uploader
          .upload(file.tempFilePath)
          .then((result) => result.secure_url)
      )
    );

    // Create new post
    const newPost = new Post({
      title,
      hotelLocation,
      description,
      facilities,
      nearArea,
      category,
      guest,
      isAvailable,
      price,
      images: imageUrls,
      slug: slug(title, { lower: true }),
    });

    await newPost.save();

    return res.status(201).json({
        message: "Post created successfully",
        post: newPost,
    });

}    catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" ,

    });
  }
};


   

    