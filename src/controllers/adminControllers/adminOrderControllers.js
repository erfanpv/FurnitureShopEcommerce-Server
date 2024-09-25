import orderDb from "../../models/schemas/orderSchema.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderDb.find().populate({
      path: 'orderDetails.products.productId', 
      model: 'products',
      select: 'productName price category image', 
    }).exec();

    if (!orders) {
      return res.status(400).json({ success: false, message: "No order found" });
    }
    
    res.status(200).json({success: true,message: "Orders fetched successfully",data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: `Bad request: ${error.message}` });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const orderByUser = await orderDb.findOne({ userId }).populate({
      path: 'orderDetails.products.productId',
      model: 'products',
      select: 'productName price category image',
    }).exec();

    if (!orderByUser || !orderByUser.orderDetails.length) {
      return res.status(200).json({ success: true, message: "No orders found for this user", data: [] });
    }

    res.status(200).json({ success: true, message: "Orders fetched successfully", data: orderByUser });
  } catch (error) {
    res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
  }
};


