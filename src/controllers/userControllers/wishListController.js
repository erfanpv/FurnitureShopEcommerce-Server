import wishListDb from "../../models/schemas/wishSchema.js";

export const toggleWishListItem = async (req, res) => {
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
      return res.status(200).json({
        success:true,
        message: "Wishlist created and item added successfully",
        wishlistCount: wishList.products.length,
      });
    } else {
      const productIndex = wishList.products.findIndex(
        (product) => product.productId.toString() === productId
      );

      if (productIndex === -1) {
        wishList.products.push({ productId });
        await wishList.save();
        return res.status(200).json({
          success:true,
          message: "Item added to wishlist successfully",
          wishlistCount: wishList.products.length,
        });
      } else {
        wishList.products.splice(productIndex, 1);
        await wishList.save();
        return res.status(200).json({
          success:true,
          message: "Item removed from wishlist successfully",
          wishlistCount: wishList.products.length,
        });
      }
    }
  } catch (error) {
    res.status(500).json({success:false,message: `Error toggling item in wishlist - ${error.message}`,
    });
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





