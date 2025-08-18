
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

export const getPostController = async (req, res) => {

   try { 

    const post = await Post.findOne({ slug: req.params.slug})
     .select("images")
     .populate("category");

     return res.status(200).send({
        success: true,
        message: "Post fetched successfully",
        post,
     });  
}   catch (error) {
      console.log(error);
      return res.status(500).send({ 
        success: false,
        message: "Error while getting post",
        error,
     });
   }
};


export const getAllPostsController = async(req, res)=>{
     
           try {
            const posts = await Post.find({});
              // .populate("category")
              // .sort({ createdAt: -1 }); // Optional: sorts by newest first
      
            return res.status(200).send({
              success: true,
              message: "All posts fetched successfully",
              posts,
            });
          

     }  catch (error){
      console.log(error);
      return res.status(500).send({
        success: false,
        message:"Error while getting all posts",
        error,
      });
     }
};



export const updatePostController = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      hotelLocation,
      description,
      facilities,
      nearArea,
      category,
      guest,
      isAvailable,
      price,
    } = req.body;
    const files = req.files?.images;

    // Find the existing post
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Validate fields (optional for update)
    if (
      !title &&
      !hotelLocation &&
      !description &&
      !facilities &&
      !nearArea &&
      !category &&
      !guest &&
      isAvailable === undefined &&
      !price &&
      !files
    ) {
      return res.status(400).json({ message: "No fields provided to update." });
    }

    // Handle image update
    // let updatedImages = post.images;
    let uploadImage = post.images;
    if (files && files.length === 3) {
      // Delete old images from Cloudinary
      await Promise.all(
        post.images.map((url) => {
          const publicId = url.split("/").pop().split(".")[0];
          return cloudinary.uploader.destroy(publicId);
        })
      );

      // Upload new images
      updatedImages = await Promise.all(
        files.map((file) =>
          cloudinary.uploader
            .upload(file.tempFilePath)
            .then((result) => result.secure_url)
        )
      );
    } else if (files && files.length !== 3) {
      return res
        .status(400)
        .json({ message: "Please upload exactly 3 images." });
    }

    // Update the post
    // const updatedPost = await Post.findByIdAndUpdate(
    const updatePost = await Post.findByIdAndUpdate(
      id,
      {
        ...(title && { title }),
        ...(hotelLocation && { hotelLocation }),
        ...(description && { description }),
        ...(facilities && { facilities }),
        ...(nearArea && { nearArea }),
        ...(category && { category }),
        ...(guest && { guest }),
        ...(isAvailable !== undefined && { isAvailable }),
        ...(price && { price }),
        // ...(files && { images: updatedImages }),
          ...(files && { images: uploadImage }),
        ...(title && { slug: slug(title, { lower: true }) }),
      });
    //   { new: true }
    // );
    await updatePost.save();
    return res.status(200).send({
      success: true,
      message:"Post updated successfully",
      updatePost,
  }); 
} catch (error) {
    console.error(error);
   return  res.status(500).send({
    success: false,
    message:"Error while updating post",
    error,
   })
  }
};

export const deletePostController = async (req, res) => {
  try {
    // await Post.findByIdAndDelete(req.params.pid);
    await Post.findByIdAndDelete(req.params.id);
    return  res.status(200).send({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

   export const getRelatedPostController =  async (req, res) => {

  
  try {
    const { pid, cid } = req.params;
    const relatedPost = await Post.find({
      category: cid,
      _id: { $ne: pid },
    })
      .select("images")
      //.select("-photos")
      .limit(2)
      .populate("category");
    return res.status(200).send({
      success: true,
      message: "Related posts fetched successfully",
      relatedPost,
    });
  } catch (error) {
    console.log(error);
     return res.status(500).send({
      success: false,
      message: "error while geting related posts",
      error,
    });
  }
};
    