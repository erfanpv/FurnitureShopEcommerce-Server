import wishListDb from "../../models/schemas/wishSchema.js";

export const addToWishList = async (req, res) => {
  try {
    const  userId  = req.params.id;
    const { productId } = req.body;
    
    
    let wishList = await wishListDb.findOne({ userId });
    if (!wishList) {
      wishList = new wishListDb({
        userId,
        products: [{ productId }],
      });
    } else {
      wishList.products.push(productId);
    }

    await wishList.save();
    res.status(200).json(wishList);

  } catch (error) {
    return res.status(500).json({ message: `Error adding item to wishlist - ${error.message}` });
  }
};
