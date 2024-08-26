import express from "express";
import {signUp,login,} from "../controllers/userControllers/userController.js";
import { getAllProducts, getproductWithCategory, getProductWithId,} from "../controllers/userControllers/productController.js";

const userRouter = express.Router();

userRouter.post("/register", signUp);
userRouter.post("/login", login);

userRouter.get("/products", getAllProducts);
userRouter.get("/products/:id", getProductWithId);
userRouter.get("/products/category/:categoryname", getproductWithCategory);

export { userRouter };
