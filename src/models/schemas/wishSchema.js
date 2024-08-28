import mongoose from "mongoose";

const wishListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        ref: "products",
        required: true,
      },
    },
  ],
});
const wishListDb = mongoose.model("WishList", wishListSchema);
export default wishListDb;
