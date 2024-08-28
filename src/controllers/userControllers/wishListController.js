import wishListDb from "../../models/schemas/wishSchema.js";

export const addToWishList = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;

    let wishList = await wishListDb.findOne({ userId });
    
    if (!wishList) {
      wishList = new wishListDb({
        userId,
        products: [{ productId }], 
      });

      await wishList.save();
      return res.status(200).json({ message: "Wishlist created and item added successfully", wishlistCount: wishList.products.length });
    } else {
      const productExists = wishList.products.some(
        (product) => product.productId.toString() === productId
      );

      if (!productExists) {
        wishList.products.push({ productId });
        await wishList.save();

        return res.status(200).json({ message: "Item added to wishlist successfully", wishlistCount: wishList.products.length });
      } else {
        return res.status(200).json({ message: "Product already in wishlist", wishlistCount: wishList.products.length });
      }
    }
  } catch (error) {
    res.status(500).json({ message: `Error adding item to wishlist - ${error.message}` });
  }
};

export const loadWishListPage = async (req, res) => {
  try {
    const userId = req.params.id;
    const wishList = await wishListDb
      .findOne({ userId })
      .populate(`products.productId`)
      .exec();
    if (!wishList || wishList?.products?.length === 0)  {
      return res.status(400).json({ message: `You don't have any Wish list` });
    }
    res.status(200).json(wishList.products);
  } catch (error) {
    res .status(500).json({ message: `internal server error - ${error.message}` });
  }
};

export const removeFromWishList = async (req, res) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;
    const updatedWishList = await wishListDb.findOneAndUpdate(
      { userId },
      { $pull: { products: { productId:productId } } },
      { new: true }
    );

    res.status(200).json(`Product removed from wishList`);
  } catch (error) {
    res.status(500).json({ message: `internal server error - ${error.message}` });
  }
};





