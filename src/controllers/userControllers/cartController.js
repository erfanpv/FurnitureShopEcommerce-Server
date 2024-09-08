import cartDb from "../../models/schemas/cartSchema.js";

export const loadCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const cart = await cartDb.findOne({ userId }).populate('products.productId').exec()
    if (!cart || cart.products.length===0) {
      return res.status(400).json({success:false, message: `Cart not found` });
  }
  res.status(200).json({success:true,message:"Cart Load Successfully",data:cart.products});

  } catch (error) {
    res.status(400).json({success:false, message: `Fetching Failed Cart -  ${error.message}` });
  }
};

export const addCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId, quantity } = req.body;
    let cart = await cartDb.findOne({ userId });

    if (!cart) {
      cart = new cartDb({
        userId,
        products: [{ productId, quantity }],
      });
    }else {
      const productIndex = cart.products.findIndex(
        (product) => product.productId.toString() === productId
      );

      if (productIndex >= 0) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    }

    await cart.save();

    res.status(200).json({success:true, message: `Product added successfully`, data:cart });
  } catch (error) {
    res.status(500).json({success:false,message: `Failed to add product - ${error.message}` });
  }
};

export const removeCart = async (req,res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;
    const updatedWishList = await cartDb.findOneAndUpdate(
      { userId },
      { $pull: { products: { productId:productId } } },
      { new: true }
    );

    res.status(200).json({success:true,message:`Product removed from Cart`});
  }catch (error) {
    res.status(500).json({success:false, message: `Failed Remove Product - ${error.message}` });
  }
}

export const incrementProductFromCart = async (req,res) => {
  try {
    const userId = req.params.id;
    const { productId,quantity } = req.body;
    let cart = await cartDb.findOne({ userId });

    const productIndex = cart.products.findIndex(
      (product) => product.productId.toString() === productId
    );
    
        
    if (productIndex >= 0) {
      cart.products[productIndex].quantity += quantity;
    }

    await cart.save();

    res.status(200).json({success:true,message:`Quantity successfully increased `});
    
  } catch (error) {
    res.status(500).json({success:false, message: `Quantiy Update Failed  - ${error.message}` });
  }
}

export const decrementProductFromCart = async (req,res) => {
  try {
    const userId = req.params.id;
    const { productId,quantity } = req.body;
    let cart = await cartDb.findOne({ userId });

    const productIndex = cart.products.findIndex(
      (product) => product.productId.toString() === productId
    );
    
        
    if (productIndex >= 0) {
      cart.products[productIndex].quantity -= quantity;
    }

    await cart.save();

    res.status(200).json({success:true,message:`Quantity successfully decreased `});
    
  } catch (error) {
    res.status(500).json({success:false, message: `Quantiy Update Failed - ${error.message}` });
  }
}

