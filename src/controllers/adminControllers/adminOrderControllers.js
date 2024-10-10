import orderDb from "../../models/schemas/orderSchema.js";
import { logActivity } from "../baseControllers/logActivity.js";

export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const orderByUser = await orderDb.findOne({ userId });

    if (!orderByUser || !orderByUser.orderDetails.length) {
      return res.status(200).json({
        success: true,
        message: "No orders found for this user",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orderByUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const validStatuses = [
      "Placed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Returned",
      "Refunded",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedOrder = await orderDb.findOneAndUpdate(
      { "orderDetails.orderId": orderId },
      {
        $set: { "orderDetails.$.status": status },
        $currentDate: {
          "orderDetails.$.processedAt": status === "Processing",
          "orderDetails.$.shippedAt": status === "Shipped",
          "orderDetails.$.deliveredAt": status === "Delivered",
          "orderDetails.$.returnedAt": status === "Returned",
          "orderDetails.$.refundedAt": status === "Refunded",
        },
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    await logActivity(`Order ${orderId} ${status}`);

    return res
      .status(200)
      .json({ message: "Order status updated successfully", updatedOrder });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong",
      details: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  const { status } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  try {
    const validStatuses = [
      "Placed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Returned",
      "Refunded",
    ];

    let matchCondition = {};
    if (status && validStatuses.includes(status)) {
      matchCondition = { "orderDetails.status": status };
    }

    const ordersAggregation = await orderDb.aggregate([
      { $unwind: "$orderDetails" },
      { $match: matchCondition },
      {
        $facet: {
          totalOrders: [{ $count: "count" }],
          orders: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    const totalOrders = ordersAggregation[0].totalOrders[0]?.count || 0;
    const orders = ordersAggregation[0].orders;

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found" });
    }

    const totalPages = Math.ceil(totalOrders / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
      pagination: {
        totalOrders,
        currentPage: page,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

export const rejectReturnOrCancelOrders = async (req, res) => {
  try {
    const { orderId } = req.params; 
    const { action } = req.body;

    let order;
    if (action === "return") {
       order = await orderDb.findOneAndUpdate(
        { "orderDetails.orderId": orderId },
        {
          $set: {
            "orderDetails.$.isCancelled": false,
            "orderDetails.$.status": "Delivered",
          },
        },
        { new: true }
      );
    }else if (action === "cancel") {
      order = await orderDb.findOneAndUpdate(
        { "orderDetails.orderId": orderId },
        {
          $set: {
            "orderDetails.$.isCancelled": false,
            "orderDetails.$.status": "Processing",
          },
        },
        { new: true }
      );
    }
    

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Order cancelled successfully", order});
  } catch (error) {
    return res.status(500).json({  message: "Failed to cancel the order",error: error.message});
  }
};

export const acceptReturnOrCancelOrder = async (req,res) => {
  try {
    const { orderId } = req.params; 
    const { action } = req.body;

    console.log("erfan",orderId,action)

    let order;
    if (action === "return") {
       order = await orderDb.findOneAndUpdate(
        { "orderDetails.orderId": orderId },
        {
          $set: {
            "orderDetails.$.isCancelled": false,
            "orderDetails.$.status": "Returned",
          },
        },
        { new: true }
      );
    }else if (action === "cancel") {
      order = await orderDb.findOneAndUpdate(
        { "orderDetails.orderId": orderId },
        {
          $set: {
            "orderDetails.$.isCancelled": false,
            "orderDetails.$.status": "Cancelled",
          },
        },
        { new: true }
      );
    }
    
    console.log(order)
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({success:true, message: "Order cancelled successfully", order});
  } catch (error) {
    return res.status(500).json({  message: "Failed to cancel the order",error: error.message});
  }
}
