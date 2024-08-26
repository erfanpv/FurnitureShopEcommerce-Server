import mongoose from "mongoose";

const productSchem = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    category: { type: String, required: true },
    is_Listed: { type: Boolean, default: true },
    stockQuantity: { type: Number },
  },
  {
    timestamps: true,
  }
);

const productDb = mongoose.model("Product", productSchem);
export default productDb;
