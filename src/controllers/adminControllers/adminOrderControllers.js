import orderDb from "../../models/schemas/orderSchema.js";

export const getAllOrders = async (req, res) => {
  try {
    const order = await orderDb.find();

    if (!order) {
      return res.status(400).json({ success: false, message: "No order found" });
    }

    res.status(200).json({success: true,message: "Orders fetched successfully",data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: `Bad request: ${error.message}` });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.id;
 
    const orderByUser = await orderDb.findOne({userId});

    if (!orderByUser) {
      return res .status(400) .json({ success: false, message: "No order found" })
    }

    res.status(200).json({success: true,message: "orders fetched succesfully", data: orderByUser});
  } catch (error) {
    res.status(500).json({ success: false, message: `Bad request: ${error.message}` });
  }
};
