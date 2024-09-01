import orderDb from "../../models/schemas/orderSchema.js";
import productDb from "../../models/schemas/productSchema.js";
import userDb from "../../models/schemas/userSchema.js";

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