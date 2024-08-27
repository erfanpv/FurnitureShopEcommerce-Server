import mongoose from "mongoose";

const cartSchmea = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
});

const cartDb = mongoose.model("cart", cartSchmea);
export default cartDb;
