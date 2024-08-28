import express from "express";
import {signUp,login,} from "../controllers/userControllers/userController.js";
import { getAllProducts, getproductWithCategory, getProductWithId,} from "../controllers/userControllers/productController.js";
import { addToWishList, loadWishListPage, removeFromWishList } from "../controllers/userControllers/wishListController.js";
import { loadCart, removeCart } from "../controllers/userControllers/cartController.js";
import handleCartAction from "../middleware/handleCartAction.js";
import checkAuth from "../middleware/checkAuth.js";
import { createOrder,  getOrdersByUser } from "../controllers/userControllers/orderController.js";
import { addAddress, getAddress, updateAddress } from "../controllers/userControllers/addressController.js";

const userRouter = express.Router();

userRouter.post("/register", signUp);
userRouter.post("/login", login);

userRouter.get("/products", getAllProducts);
userRouter.get("/products/:id", getProductWithId);

userRouter.get("/products/category/:categoryname", getproductWithCategory);

userRouter.post("/:id/wishlist",addToWishList);
userRouter.get("/:id/wishlist",checkAuth,loadWishListPage);
userRouter.delete("/:id/wishlist",removeFromWishList);

userRouter.get("/:id/cart",loadCart);
userRouter.post("/:id/cart", handleCartAction, (req, res, next) => req.controller(req, res, next));
userRouter.delete("/:id/cart",removeCart);

userRouter.post("/:id/orders", createOrder);
userRouter.get("/:id/orders", getOrdersByUser);

userRouter.post("/:id/address",addAddress)
userRouter.get("/:id/address",getAddress)
userRouter.put("/:id/address",updateAddress)

export { userRouter };
