import express from "express";
import { adminLogin } from "../controllers/adminControllers/adminLoginController.js";
import {  getAllUsers } from "../controllers/adminControllers/customerController.js";
import checkAuth from "../middleware/checkAuth.js";
import userManagement from "../middleware/handleUserManagement.js";
import { adminGetAllProducts, adminGetProductWithId } from "../controllers/adminControllers/adminProductController.js";

const adminRouter = express.Router();

adminRouter.post("/login",adminLogin)

adminRouter.get("/users",checkAuth,getAllUsers)
adminRouter.get("/users/:id",checkAuth,userManagement,(req, res, next) => req.controller(req, res, next))

adminRouter.get("/products",checkAuth,adminGetAllProducts)
adminRouter.get("/products/:id",checkAuth,adminGetProductWithId)

export default adminRouter