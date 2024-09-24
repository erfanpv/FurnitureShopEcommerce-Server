import cartDb from "../../models/schemas/cartSchema.js";

export const loadCart = async (req, res) => {
  try {
    const userId = req.params.id;

    const cart = await cartDb.findOne({ userId }).populate('products.productId').exec();

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found." });
    }

    if (cart.products.length === 0) {
      return res.status(200).json({ success: true, message: "Cart is empty.", data: [], cartId: cart._id });
    }

    res.status(200).json({ success: true, message: "Cart loaded successfully.", data: cart.products, cartId: cart._id });

  } catch (error) {
    res.status(500).json({ success: false, message: `Failed to fetch cart - ${error.message}` });
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

    res.status(200).json({success:true, message: `Product added successfully`, data:{cart,productId,quantity} });
  } catch (error) {
    res.status(500).json({success:false,message: `Failed to add product - ${error.message}` });
  }
};

export const removeCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body; 

    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: "User ID and Product ID are required." });
    }

    const updatedCart = await cartDb.findOneAndUpdate(
      { userId },
      { $pull: { products: { productId } } }, 
      { new: true }
    ).populate('products.productId').exec()

    if (!updatedCart) {
      return res.status(404).json({ success: false, message: "Cart or Product not found." });
    }
    res.status(200).json({ success: true, message: "Product removed from Cart", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: `Failed to Remove Product - ${error.message}` });
  }
};


export const incrementProductFromCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;


    let cart = await cartDb.findOne({ userId }).populate({
      path: 'products.productId', 
      select: 'productName price image'
    });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (product) => product.productId._id.toString() === productId
    );

    if (productIndex >= 0) {
      cart.products[productIndex].quantity += 1;
      await cart.save();

      cart = await cartDb.findOne({ userId }).populate({
        path: 'products.productId',
        select: 'productName price image'
      });

      res.status(200).json({ success: true, message: "Quantity successfully increased", cart });
    } else {
      res.status(404).json({ success: false, message: "Product not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: `Quantity Update Failed - ${error.message}` });
  }
};


export const decrementProductFromCart = async (req, res) => {
  try {
    const userId = req.params.id; 
    const { productId } = req.body; 
    
    let cart = await cartDb.findOne({ userId }).populate({
      path: "products.productId",
      select: "productName price image",
    });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (product) => product.productId._id.toString() === productId
    );
    console.log(productIndex);
    
    if (productIndex >= 0) {
      if (cart.products[productIndex].quantity > 1) {
        cart.products[productIndex].quantity -= 1;
        await cart.save();
      } else {
        cart.products.splice(productIndex, 1);
        await cart.save();
      }

      cart = await cartDb.findOne({ userId }).populate({
        path: "products.productId",
        select: "productName price image",
      });

      res
        .status(200)
        .json({ success: true, message: "Quantity successfully decreased", cart });
    } else {
      res.status(404).json({ success: false, message: "Product not found in cart" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `Quantity Update Failed - ${error.message}` });
  }
};
