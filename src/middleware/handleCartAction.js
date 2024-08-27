import { addCart, decrementProductFromCart, incrementProductFromCart } from "../controllers/userControllers/cartController.js";

const handleCartAction = (req, res, next) => {
  const { action } = req.body;

  if (action === "increment") {
    req.controller = incrementProductFromCart
  } else if (action === "decrement") {
    req.controller = decrementProductFromCart
  }
  else {
    req.controller = addCart;
  }

  next();
};

export default handleCartAction