import express from "express";
import { adminLogin } from "../controllers/adminControllers/adminLoginController.js";
import {  getAllUsers } from "../controllers/adminControllers/customerController.js";
import checkAuth from "../middleware/checkAuth.js";
import userManagement from "../middleware/handleUserManagement.js";
import { addProduct, adminGetAllProducts, adminGetProductWithId, deleteProduct, updateProduct } from "../controllers/adminControllers/adminProductController.js";
import { getAllOrders } from "../controllers/adminControllers/adminOrderControllers.js";
import { getTotalSales, getTotalSalesCount } from "../controllers/adminControllers/adminDashBoard.js";

const adminRouter = express.Router();

adminRouter.post("/login",adminLogin)

adminRouter.get("/users",checkAuth,getAllUsers)
adminRouter.get("/users/:id",checkAuth,userManagement,(req, res, next) => req.controller(req, res, next))

adminRouter.get("/products",checkAuth,adminGetAllProducts)
adminRouter.get("/products/:id",checkAuth,adminGetProductWithId)
adminRouter.post("/products",checkAuth,addProduct)
adminRouter.put("/products/:id",checkAuth,updateProduct)
adminRouter.delete("/products",checkAuth,deleteProduct)

adminRouter.get("/orders",checkAuth,getAllOrders)
adminRouter.get("/orders/:id",checkAuth,getAllOrders)

// adminRouter.get("/dashboard-revenue",getTotalSales)
adminRouter.get("/dashboard-revenue",getTotalSalesCount)

export default adminRouter