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
    } else {
      wishList.products.push(productId);
    }

    await wishList.save();
    res.status(200).json(wishList);
  } catch (error) {
    res.status(500).json({ message: `Error adding item to wishlist - ${error.message}` });
  }
};

export const loadWishListPage = async (req, res) => {
  try {
    const userId = req.params.id;
    const wishList = await wishListDb
      .findOne({ userId })
      .populate("products.productId")
      .exec();
    if (!wishList) {
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
      { $pull: { products: { productId } } },
      { new: true }
    );

    res.status(200).json(`Product removed from wishList`);
  } catch (error) {
    res.status(500).json({ message: `internal server error - ${error.message}` });
  }
};
