import express from "express";
import {signUp,login,} from "../controllers/userControllers/userController.js";
import { getAllProducts, getproductWithCategory, getProductWithId,} from "../controllers/userControllers/productController.js";
import { loadWishListPage, removeFromWishList, toggleWishListItem } from "../controllers/userControllers/wishListController.js";
import { loadCart, removeCart } from "../controllers/userControllers/cartController.js";
import handleCartAction from "../middleware/handleCartAction.js";
import checkAuth from "../middleware/checkAuth.js";
import { createOrder,  createOrderbyCart,  getOrdersByUser } from "../controllers/userControllers/orderController.js";
import { addAddress, getAddress, updateAddress } from "../controllers/userControllers/addressController.js";
import handleController from "../utils/constant.js";
import { stripeIntent } from "../controllers/userControllers/stripeController.js";

const userRouter = express.Router();

userRouter.post("/register", signUp);
userRouter.post("/login", login);

userRouter.get("/products", getAllProducts);
userRouter.get("/products/:id", getProductWithId);
userRouter.get("/products/category/:categoryname", getproductWithCategory);

userRouter.post("/:id/wishlist",toggleWishListItem);
userRouter.get("/:id/wishlist",checkAuth,loadWishListPage);
userRouter.delete("/:id/wishlist",removeFromWishList);

userRouter.get("/:id/cart",loadCart);
userRouter.post("/:id/cart", handleCartAction, handleController);
userRouter.delete("/:id/cart",removeCart);

userRouter.post("/payment/:id",checkAuth,stripeIntent)

userRouter.post("/orders", createOrder);
userRouter.post("/cart/orders", createOrderbyCart);
userRouter.get("/orders", getOrdersByUser);

userRouter.post("/:id/address",addAddress)
userRouter.get("/:id/address",getAddress)
userRouter.put("/:id/address",updateAddress)

export default userRouter;
