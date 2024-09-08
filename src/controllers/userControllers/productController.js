import productDb from "../../models/schemas/productSchema.js";

export const getAllProducts = async (req, res) => {
  try {
    const productsList = await productDb.find({is_Listed: { $ne: false } });    

    if (!productsList || productsList?.length===0) {
      return res.status(404).json({success:false, message: "Products Not found" });
    }
    return res.status(200).json({ success: true ,message: "All Products Fetched",data:productsList});
  } catch (error) {
    res.status(500).json({success:false, message: `Error fetching Products - ${error.message}`});
  }
};

export const getProductWithId = async (req, res) => {
  try {
    const productId = req.params.id;
    const productById = await productDb.findById(productId);

    if (!productById || productById?.length===0) {
      return res.status(404).json({success:false,message: "Product not found" });
    }
    res.status(200).json({success:true,message: "Product Fetched by Specific Id",data:productById});
  } catch (error) {
    res.status(500).json({success:false, message: `Error fetching product - ${error.message}` });
  }
};


export const getproductWithCategory = async (req,res) => {
  try {
    const categoryName = req.params.categoryname;
    const productsWithCategory = await productDb.find({ category:categoryName});

    if (productsWithCategory.length === 0) {
      return res.status(404).json({success:false, message: "Categories not found" });
    }
    return res.status(200).json({success:true,message:"Product Fetched by Category",data:productsWithCategory})
  }catch (error) {
    return res.status(500).json({success:false,message:`Error fetching Categories - ${error.message}`})
  }
}


export const getUniqueProductCategories = async (req, res) => {
  try {
    const uniqueCategories = await productDb.distinct("category");    

    if (uniqueCategories.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No categories found" });
    }

    return res.status(200).json({
      success: true,
      message: "Unique categories fetched successfully",
      data: uniqueCategories,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: `Error fetching unique categories - ${error.message}`,
      });
  }
};

