import orderDb from "../../models/schemas/orderSchema.js";

export const getPaymentData = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10; 
  const skip = (page - 1) * limit;

  try {
    const orders = await orderDb.find().select("orderDetails");
    
    const paymentDetails = orders.flatMap(order =>
      order.orderDetails.map(detail => ({
        paymentId: detail.paymentId,
        transactionId: detail.orderId,
        user: detail.orderedUserName,
        amount: detail.total,
        method: detail.payment_method,
        status: detail.status,
        date: detail.createdAt,
      }))
    );

    const paginatedPayments = paymentDetails.slice(skip, skip + limit);

    const totalPayments = paymentDetails.length;
    const totalPages = Math.ceil(totalPayments / limit);

    res.status(200).json({
      payments: paginatedPayments, 
      pagination: {
        totalPages,
        currentPage: page,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payment activity", error });
  }
};
