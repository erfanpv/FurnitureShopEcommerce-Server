import orderDb from "../../models/schemas/orderSchema.js";
import productDb from "../../models/schemas/productSchema.js";
import userDb from "../../models/schemas/userSchema.js";
import activityDb from "../../models/schemas/activitySchema.js";


export const getTotalSalesAmount = async (req, res) => {
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

    res.status(200).json({success: true,message: "Total sales amount calculated successfully.",totalSalesAmount: salesAmount });
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

    res.status(200).json({ success: true, message: "Total sales count calculated successfully.", totalSalesCount: salesCount});
  } catch (error) {
    res.status(500).json({success: false,message: `Error calculating total sales count: ${error.message}` });
  }
};

export const getTotalUsersCount = async (req, res) => {
  try {
   const totalUsersResult =  await userDb.aggregate([{$match: {role:"user",is_blocked:false}},{$count : 'totalUsers'}]);
   const totalUsersCount = totalUsersResult.length > 0 ? totalUsersResult[0].totalUsers : 0;
   res.status(200).json({ success: true, message: "Total Users count calculated successfully.",  totalUsersCount});
  } catch (error) {
    res.status(500).json({success: false,message: `Error calculating total Users count: ${error.message}` });
  }
};

export const getTotalProductsCount = async (req, res) => {
  try {
   const totalProductsResult =  await productDb.aggregate([{$match: {is_Listed:true}},{$count : 'totalProducts'}]);
   const totalProductsCount = totalProductsResult.length > 0 ? totalProductsResult[0].totalProducts : 0;
   res.status(200).json({ success: true, message: "Total Products count calculated successfully.",  totalProductsCount});
  } catch (error) {
    res.status(500).json({success: false,message: `Error calculating total Products count: ${error.message}` });
  }
};

export const getTotalStocksCount = async (req, res) => {
  try {
   const totalStockResult =  await productDb.aggregate([{$match: {is_Listed:true}},{$group: {_id:null,totalStock:{$sum:"$stockQuantity"}}}]);
   const totalStockCount = totalStockResult.length > 0 ? totalStockResult[0].totalStock : 0;
   res.status(200).json({ success: true, message: "Total Stock count calculated successfully.",  totalStockCount});
  } catch (error) {
    res.status(500).json({success: false,message: `Error calculating total Stock count: ${error.message}` });
  }
};


export const getRecentOrders = async (req, res) => {
  try {
    const recentOrdersAggregation = await orderDb.aggregate([
      { $unwind: "$orderDetails" }, 
      { $sort: { "orderDetails.createdAt": -1 }},
      {
        $facet: {
          orders: [{ $limit: 3 }] 
        }
      }
    ]);

    const recentOrders = recentOrdersAggregation[0].orders;

    if (!recentOrders || recentOrders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }

    res.status(200).json({
      success: true,
      message: "Recent orders fetched successfully",
      data: recentOrders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
};


export const getRecentActivities = async (req, res) => {
  try {
    const recentActivities = await activityDb.find()
      .sort({ date: -1 }) 
      .limit(4) 
      .select('action date -_id');

    if (!recentActivities || recentActivities.length === 0) {
      return res.status(404).json({ success: false, message: 'No activities found.' });
    }

    res.status(200).json({success: true,message: 'Recent activities fetched successfully',data: recentActivities});
  } catch (error) {
    res.status(500).json({ success: false, message: `Server error: ${error.message}` });
  }
};


export const getSalesDataForChart =  async (req,res) => {
  const year = parseInt(req.query.year);

  try {
    const salesData = await orderDb.aggregate([
      {
        $match: {
          "orderDetails.createdAt": {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      { $unwind: "$orderDetails" },
      {
        $group: {
          _id: { month: { $month: "$orderDetails.createdAt" } },
          totalSales: { $sum: "$orderDetails.total" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    const formattedSalesData = salesData.map((data) => {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return {
        name: monthNames[data._id.month - 1], 
        sales: data.totalSales,
        year: year,
      };
    });
    res.json(formattedSalesData);
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ message: "Error retrieving sales data" });
  }
}

export const getRevenueDataForGraph = async (req, res) => {
  try {
    const revenueData = await orderDb.aggregate([
      { $unwind: "$orderDetails" }, 
      {
        $group: {
          _id: { $dayOfWeek: "$orderDetails.createdAt" }, 
          totalRevenue: { $sum: "$orderDetails.total" }, 
        },
      },
      { $sort: { "_id": 1 } }, 
    ]);

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const formattedRevenueData = revenueData.map((data) => ({
      name: daysOfWeek[data._id - 1], 
      revenue: data.totalRevenue,
    }));

    res.json(formattedRevenueData);
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    res.status(500).json({ message: "Error retrieving revenue data" });
  }
};





