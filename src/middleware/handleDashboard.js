import { getTotalProductsCount, getTotalSalesAmount, getTotalSalesCount, getTotalStocksCount, getTotalUsersCount } from "../controllers/adminControllers/adminDashBoard.js";

export const dashboardManager = (req, res, next) => {
  try {
    const { action } = req.body;
    if (action === "totalUsers") {
      req.controller = getTotalUsersCount;
    } else if (action === "totalProducts") {
      req.controller = getTotalProductsCount;
    } else if (action === "totalStocks") {
      req.controller = getTotalStocksCount;
    } else if (action === "totalSalesCount") {
      req.controller = getTotalSalesCount;
    } else if (action === "totalSalesAmount") {
      req.controller = getTotalSalesAmount;
    }

    next();
  } catch (error) {
    res.status(500).json({success:false,message:`Bad Request ${error.message}`})
  }
};

