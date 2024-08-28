import orderDb from "../../models/schemas/orderSchema.js";
import userDb from "../../models/schemas/userSchema.js";
import wishListDb from "../../models/schemas/wishSchema.js";

export const createOrder = async (req, res) => {
  try {
    const { userId, products, address, payment_method } = req.body;

    const newOrder = new orderDb({
      userId,
      products,
      status: "Placed",
      payment_method,
      address,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
};