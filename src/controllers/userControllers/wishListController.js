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
            data:wishList
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
              data:wishList
            });
          } else {
            wishList.products.splice(productIndex, 1);
            await wishList.save();
            return res.status(200).json({
              success:true,
              message: "Item removed from wishlist successfully",
              data:wishList
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
    
        if (!wishList) {
          return res.status(404).json({ success: false, message: "Wishlist not found for this user." });
        }
    
        if (wishList.products.length === 0) {
          return res.status(204).json({ success: true, message: "Wishlist is empty." }); // No content
        }
    
        res.status(200).json({ success: true, message: "Wishlist fetched successfully", data: wishList });
      } catch (error) {
        res.status(500).json({ success: false, message: `Internal server error - ${error.message}` });
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

        res.status(200).json({success:true,message:`Product removed from wishList`});
      } catch (error) {
        res.status(500).json({success:false, message: `internal server error - ${error.message}` });
      }
    };





