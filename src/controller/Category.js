
import CategoryModel from "../models/Category.js";
import slug from "slugify";
import postModel from "../models/Post.js";
export const createCategoryController= async(req, res) => {

    try {
        const { name } = req.body;
         if (!name) {
            return res.status(400).json({
            message: "Name is required",     
  });
}
     const existinCategory= await CategoryModel.findOne({ name });
    
if (existinCategory) {
  return res.status(400).json({
    message: "Category already exists",
  });
}

  const newCategory= await new CategoryModel({
    name,
    slug: slug(name),

  }).save();
   return res.status(200).send({
    success : true,
    message : "Category has been created",
    newCategory,
   })


    } 
   catch (error) {
   console.log(error);
   return res.status(500).send({
    success: false,
    message: "Error while creating category",
    error,
  });
}



};

export const getAllCategory = async (req, res)=>{
  try{
    const categories = await CategoryModel.find({});
     return res.status(200).send({
      success: true,
      message: "Categories fetched successfully",
      categories,
     });

  } catch (error){
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error while fetching categories",
      error,
    })

  }

}

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      messsage: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).send({
      success: false,
      error,
      message: "Error while updating category",
    });
  }
};

//delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await CategoryModel.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      message: "Categry Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return  res.status(500).send({
      success: false,
      message: "error while deleting category",
      error,
    });
  }
};

// single category
export const singleCategoryController = async (req, res) => {
  try {
    const category = await CategoryModel.findOne({ slug: req.params.slug });
    const post = await postModel.find({category}).populate("category");
    return res.status(200).send({
      success: true,
      message: "Get SIngle Category SUccessfully",
      category,
      post,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single Category",
    });
  }
};



