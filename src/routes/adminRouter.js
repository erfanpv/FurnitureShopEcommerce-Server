import express from "express";
import {  getAllUsers, getUserById, searchUsers, toggleUserBlockStatus } from "../controllers/adminControllers/customerController.js";
import checkAuth from "../middleware/checkAuth.js";
import { addProduct, adminGetAllProducts, adminGetProductWithId, deleteProduct, getUniqueProductCategories, searchProducts, updateProduct } from "../controllers/adminControllers/adminProductController.js";
import { getAllOrders, getOrdersByUser } from "../controllers/adminControllers/adminOrderControllers.js";
import { dashboardManager } from "../middleware/handleDashboard.js";
import handleController from "../utils/constant.js";

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

adminRouter.get("/dashboard",checkAuth,dashboardManager,handleController)

export default adminRouter