// import productDb from "../../models/productSchem";

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
