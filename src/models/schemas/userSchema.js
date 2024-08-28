import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    // mobile: {
    //   type: String,
    //   required: true,
    // },
    password: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
    },
    profileThumb: {
      type: String,
    },
    is_blocked: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cart",
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
    },
    wishList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "wishlist",
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
    },
  },
  {
    timestamps: true,
  }
);

const userDb = mongoose.model("users", userSchema);
export default userDb;