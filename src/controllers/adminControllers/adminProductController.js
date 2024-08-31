import mongoose from "mongoose";
import lodash from "lodash";
import productDb from "../../models/schemas/productSchema.js";
import productValidation from "../../models/joiValidations/productValidation.js";

export const adminGetAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    
    let productsList;

    if (category) {
      productsList = await productDb.find({ category });
      
      
      if (productsList?.length === 0) {
        return res.status(400).json({ success: false, message: "Category not found" });
      }
    }else {
      productsList = await productDb.find();
    }

    if (!productsList || productsList?.length===0) {
      return res.status(404).json({success:false, message: "Products Not found" });
    }
  } catch (error) {
    res.status(500).json({success:false, message: `Error fetching Products - ${error.message}`});
  }
};

export const adminGetProductWithId = async (req, res) => {
  try {
    const productId = req.params.id;
    const productById = await productDb.findById(productId);

    if (!productById || productById?.length===0) {
      return res.status(404).json({success:false,message: "Product not found" });
    }
    res.status(200).json({success:true,message: "Product Fetched",data:productById});
  } catch (error) {
    res.status(500).json({success:false, message: `Error fetching product - ${error.message}` });
  }
};

export const addProduct = async(req, res) => {
  try {
    const { productName,category,description,} = req.body;
    
    const validatedProduct =  await productValidation.validateAsync(req.body)
    const existProducts =  await productDb.findOne({productName})
    
    if (existProducts) {
      return res.status(500).json({success:false,message: `Product already existed ${productName}`})
    }

    if (productName.trim().length === 0 || category.trim().length === 0 || description.trim().length === 0) {
      return res.status(500).json({success: false, message: `Spaces only not accepted` });
    }

    const newProduct = new productDb(validatedProduct);

    await newProduct.save();
    
    res.status(200).json({ success: true, message: `Product added`, data: newProduct });
  } catch (error) {
    res.status(401).json({success:false, message: `error occured ${error.message}` });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    await productValidation.validateAsync(req.body);    

    const existingProduct = await productDb.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    const { isEqual } = lodash;
    const isDataSame = isEqual(req.body, {
      productName: existingProduct.productName,
      description: existingProduct.description,
      price: existingProduct.price,
      image: existingProduct.image,
      category: existingProduct.category,
      stockQuantity: existingProduct.stockQuantity,
      is_Listed:existingProduct.is_Listed,
      is_deleted:existingProduct.is_deleted
    });

    if (isDataSame) {
      return res.status(400).json({success: false,message: "No changes were made as the product details are the same."});
    }

    const updatedProduct = await productDb.findByIdAndUpdate(productId, req.body, { new: true });

    res.status(200).json({success: true,message: "Product updated successfully",data: updatedProduct});
  } catch (error) {
    if (error.isJoi === true) {
      return res.status(400).json({ success: false, message: `Validation error: ${error.message}` });
    }

    res.status(500).json({ success: false, message: `Bad request: ${error.message}` });
  }
};



export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "No product found" });
    }

    const deleteProduct = await productDb.findByIdAndDelete(productId);

    if (!deleteProduct) {
      return res.status(400).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({success: true,message: "Product deleted successfully",data: deleteProduct,});

  } catch (error) {
    res.status(500).json({ success: false, message: `Bad request:${error.message}` });
  }
};

