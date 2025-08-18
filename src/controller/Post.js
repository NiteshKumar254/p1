
    import cloudinary from "../config/Cloudinary.js";
import Post from "../models/Post.js";
import slug from "slugify";

// CREATE POST
export const createPostController = async (req, res) => {
  try {
    const {
      title,
      hotelLocation,
      description,
      category,
      isAvailable,
      guest,
      price,
      nearArea,
      facilities,
    } = req.body;

    const files = req.files?.images;

    // validation
    if (
      !title ||
      !hotelLocation ||
      !description ||
      !files ||
      !guest ||
      !isAvailable ||
      !price ||
      !nearArea ||
      !facilities ||
      !category
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!files || files.length !== 3) {
      return res
        .status(400)
        .json({ message: "Please upload exactly 3 images." });
    }

    // upload images
    const imageUrls = await Promise.all(
      files.map((file) =>
        cloudinary.uploader
          .upload(file.tempFilePath)
          .then((result) => result.secure_url)
      )
    );

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
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// GET SINGLE POST
export const getPostController = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate(
      "category"
    );

    return res.status(200).send({
      success: true,
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while getting post",
      error,
    });
  }
};

// GET ALL POSTS
export const getAllPostsController = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      message: "All posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while getting all posts",
      error,
    });
  }
};

// UPDATE POST
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

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // handle images
    let updatedImages = post.images;
    if (files && files.length === 3) {
      // delete old images
      await Promise.all(
        post.images.map((url) => {
          const publicId = url.split("/").pop().split(".")[0];
          return cloudinary.uploader.destroy(publicId);
        })
      );

      // upload new ones
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

    // update post
    const updatedPost = await Post.findByIdAndUpdate(
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
        ...(files && { images: updatedImages }),
        ...(title && { slug: slug(title, { lower: true }) }),
      },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error while updating post",
      error,
    });
  }
};

// DELETE POST
export const deletePostController = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while deleting post",
      error,
    });
  }
};


import mongoose from "mongoose";

// GET RELATED POSTS
export const getRelatedPostController = async (req, res) => {
  try {
    const { pid, cid } = req.params;

    const relatedPost = await Post.find({
      category: cid,
      _id: { $ne: new mongoose.Types.ObjectId(pid) }, // ✅ yaha fix
    })
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
      message: "Error while getting related posts",
      error,
    });
  }
};

export const searchProductController = async (req, res) => {

  try {
    const {keyword} = req.params;
    const words = keyword.split(" ");
    const regexString= words.join("|");

    const results = await Post.find({
      $or:  [
        {title : { $regex: keyword, $options: "i"}},
        {
          description: {
            $regex: regexString,
            $options: "i" ,
          },
        },

      ],
    })
      .select("title hotelLocation  images  description")
      // .populate("category");
      res.json(results);

  }  catch (error){
    console.log(error);
    return res.status(500).send({
      success:false,
      message: "Error while searching posts",
      error,
    });  
  }
};
