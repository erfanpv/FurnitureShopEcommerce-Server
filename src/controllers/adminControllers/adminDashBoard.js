import orderDb from "../../models/schemas/orderSchema.js";

export const getTotalSales = async (req, res) => {
  try {
    const totalSales = await orderDb.aggregate([
      { $unwind: "$orderDetails" },  
      {
        $group: {
          _id: null, 
          totalSales: { $sum: "$orderDetails.total" }, 
        },
      },
    ]);    

    const salesAmount = totalSales.length > 0 ? totalSales[0].totalSales : 0;

    res.status(200).json({success: true,message: "Total sales amount calculated successfully.",totalSales: salesAmount });
  } catch (error) {
    res.status(500).json({success: false,message: `Error calculating total sales: ${error.message}`});
  }
};



export const getTotalSalesCount = async (req, res) => {
  try {
    const totalSalesCount = await orderDb.aggregate([
      { $unwind: "$orderDetails" },  
      {
        $group: {
          _id: null, 
          salesCount: { $sum: 1 }, 
        },
      },
    ]);

    const salesCount = totalSalesCount.length > 0 ? totalSalesCount[0].salesCount : 0;

    res.status(200).json({
      success: true,
      message: "Total sales count calculated successfully.",
      totalSalesCount: salesCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error calculating total sales count: ${error.message}`,
    });
  }
};
