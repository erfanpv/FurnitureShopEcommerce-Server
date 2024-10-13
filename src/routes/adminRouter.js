import express from "express";
import {  getAllUsers, getUserById, searchUsers, toggleUserBlockStatus } from "../controllers/adminControllers/customerController.js";
import checkAuth from "../middleware/checkAuth.js";
import { addProduct, adminGetAllProducts, adminGetProductWithId, deleteProduct, getUniqueProductCategories, searchProducts, updateProduct } from "../controllers/adminControllers/adminProductController.js";
import { acceptReturnOrCancelOrder, getAllOrders, getOrdersByUser, refundPayment, rejectReturnOrCancelOrders, updateOrderStatus } from "../controllers/adminControllers/adminOrderControllers.js";
import { dashboardManager } from "../middleware/handleDashboard.js";
import handleController from "../utils/constant.js";
import { getAllUserMessages, getTotalPendingMessageCount, messageStatusUpdate } from "../controllers/adminControllers/contactController.js";
import { createReports } from "../controllers/adminControllers/reportController.js";
import { getPaymentData } from "../controllers/adminControllers/paymentController.js";

const adminRouter = express.Router();


adminRouter.get("/users",checkAuth,getAllUsers)
adminRouter.get("/users/:id",checkAuth,getUserById)
adminRouter.get("/search/users",checkAuth,searchUsers)
adminRouter.put("/users/:id/toggle-block",checkAuth,toggleUserBlockStatus)

adminRouter.get("/products", checkAuth, adminGetAllProducts);
adminRouter.get("/products/:id",checkAuth,adminGetProductWithId)
adminRouter.get("/products/categorylist/unique",checkAuth,getUniqueProductCategories)
adminRouter.get("/search/products",checkAuth,searchProducts)
adminRouter.post("/products",checkAuth,addProduct)
adminRouter.put("/products/:id",checkAuth,updateProduct)
adminRouter.delete("/products/:id",checkAuth,deleteProduct)

adminRouter.get("/orders",checkAuth,getAllOrders)
adminRouter.get("/orders/:id",checkAuth,getOrdersByUser)
adminRouter.put("/orders/:id/status",checkAuth,updateOrderStatus)
adminRouter.put("/orders/reject/:orderId",checkAuth,rejectReturnOrCancelOrders)
adminRouter.put("/orders/allow/:orderId",checkAuth,acceptReturnOrCancelOrder)
adminRouter.put("/orders/refund/:orderId",checkAuth,refundPayment)

adminRouter.get("/dashboard",checkAuth,dashboardManager,handleController)
adminRouter.post("/dashboard/create-report",checkAuth,createReports)

adminRouter.get("/payment-activity",checkAuth,getPaymentData)


adminRouter.get("/all-contact",checkAuth,getAllUserMessages)
adminRouter.get("/pending-contact-count",checkAuth,getTotalPendingMessageCount)
adminRouter.put("/messages/update-status/:messageId",checkAuth,messageStatusUpdate)

export default adminRouter