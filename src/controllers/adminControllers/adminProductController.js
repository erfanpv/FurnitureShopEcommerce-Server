import productDb from "../../models/schemas/productSchema.js";

export const adminGetAllProducts = async (req, res) => {
  try {
    const productsList = await productDb.find();

    if (!productsList || productsList?.length===0) {
      return res.status(404).json({success:false, message: "Products Not found" });
    }
    return res.status(200).json({ success: true ,message: "All Products Fetched",data:productsList});
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

// export const addProduct = async(req, res) => {
//   try {
//     const { productName } = req.body;
//     const validatedProduct =  await productDb.validateAsync(req.body)
//     const existProducts =  await productDb.findOne({productName})

//     if (existProducts) {
//       return res.status(500).json({success:false,message: `Product already existed ${productName}`})
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(401).json({ message: `error occured ${error.message}` });
//   }
// };
