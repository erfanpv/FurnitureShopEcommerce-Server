import express from "express";
import {  getAllUsers } from "../controllers/adminControllers/customerController.js";
import checkAuth from "../middleware/checkAuth.js";
import userManagement from "../middleware/handleUserManagement.js";
import { addProduct, adminGetAllProducts, adminGetProductWithId, deleteProduct, updateProduct } from "../controllers/adminControllers/adminProductController.js";
import { getAllOrders, getOrdersByUser } from "../controllers/adminControllers/adminOrderControllers.js";
import { dashboardManager } from "../middleware/handleDashboard.js";
import handleController from "../utils/constant.js";

const adminRouter = express.Router();


adminRouter.get("/users",checkAuth,getAllUsers)
adminRouter.get("/users/:id",checkAuth,userManagement,handleController)

adminRouter.get("/products",checkAuth,adminGetAllProducts)
adminRouter.get("/products/:id",checkAuth,adminGetProductWithId)
adminRouter.post("/products",checkAuth,addProduct)
adminRouter.put("/products/:id",checkAuth,updateProduct)
adminRouter.delete("/products",checkAuth,deleteProduct)

adminRouter.get("/orders",checkAuth,getAllOrders)
adminRouter.get("/orders/:id",checkAuth,getOrdersByUser)

adminRouter.get("/dashboard-revenue",checkAuth,dashboardManager,handleController)

export default adminRouter