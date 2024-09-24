import express from "express";
import { getAllProducts, getproductWithCategory, getProductWithId, getUniqueProductCategories,} from "../controllers/userControllers/productController.js";
import { loadWishListPage, removeFromWishList, toggleWishListItem } from "../controllers/userControllers/wishListController.js";
import { loadCart, removeCart } from "../controllers/userControllers/cartController.js";
import handleCartAction from "../middleware/handleCartAction.js";
import checkAuth from "../middleware/checkAuth.js";
import { createOrder,  createOrderbyCart,  getOrdersByUser } from "../controllers/userControllers/orderController.js";
import { addAddress, getAddress, updateAddress } from "../controllers/userControllers/addressController.js";
import handleController from "../utils/constant.js";
import { stripeIntent, successPayment } from "../controllers/userControllers/stripeController.js";
import { searchProducts } from "../controllers/userControllers/searchController.js";
import { login, signUp } from "../controllers/authController/authController.js";

const userRouter = express.Router();

userRouter.post("/register", signUp);
userRouter.post("/login", login);

userRouter.get("/products", getAllProducts);
userRouter.get("/products/:id", getProductWithId);
userRouter.get("/products/category/:categoryname", getproductWithCategory);
userRouter.get("/products/categorylist/unique", getUniqueProductCategories);

userRouter.get("/search/products",searchProducts)

userRouter.get("/:id/wishlist",checkAuth,loadWishListPage);
userRouter.post("/:id/wishlist",checkAuth,toggleWishListItem);
userRouter.delete("/:id/wishlist",checkAuth,removeFromWishList);

userRouter.get("/:id/cart",checkAuth,loadCart);
userRouter.post("/:id/cart",checkAuth, handleCartAction, handleController);
userRouter.delete("/:id/cart",checkAuth,removeCart);

userRouter.post("/payment/:id",checkAuth,stripeIntent)
userRouter.get("/payment/success/:id",successPayment)

userRouter.get("/orders/:id",checkAuth, getOrdersByUser);
userRouter.post("/orders",checkAuth, createOrder);
userRouter.post("/cart/orders",checkAuth, createOrderbyCart);


userRouter.post("/:id/address",checkAuth,addAddress)
userRouter.get("/:id/address",checkAuth,getAddress)
userRouter.put("/:id/address",checkAuth,updateAddress)


export default userRouter;
