import express from "express";
import { signUp,login } from "../controllers/userControllers/userController.js";
import checkAuth from "../middleware/checkAuth.js";
import { getAllProducts } from "../controllers/productController.js";

const userRouter = express.Router();

userRouter.post("/register", signUp);
userRouter.post("/login", login);

userRouter.get("/products",getAllProducts);

export { userRouter };
