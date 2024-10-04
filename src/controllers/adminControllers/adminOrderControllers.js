import orderDb from "../../models/schemas/orderSchema.js";


export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;  
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;

    const ordersAggregation = await orderDb.aggregate([
      { $unwind: "$orderDetails" },
      {
        $facet: {
          totalOrders: [{ $count: "count" }], 
          orders: [
            { $skip: skip },
            { $limit: limit } 
          ]
        }
      }
    ]);

    const totalOrders = ordersAggregation[0].totalOrders[0]?.count || 0; 
    const orders = ordersAggregation[0].orders;

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found" });
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
        hasPreviousPage 
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
};


export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const orderByUser = await orderDb.findOne({ userId })


    if (!orderByUser || !orderByUser.orderDetails.length) {
      return res.status(200).json({ success: true, message: "No orders found for this user", data: [] });
    }

    res.status(200).json({ success: true, message: "Orders fetched successfully", data: orderByUser });
  } catch (error) {
    res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
  }
};



export const updateOrderStatus = async (req, res) => {
  try {
    const orderId  = req.params.id;
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

    return res.status(200).json({
      message: "Order status updated successfully",
      updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong",
      details: error.message,
    });
  }
};
