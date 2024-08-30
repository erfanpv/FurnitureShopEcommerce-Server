import { adminBlockUser, adminUnBlockUser, getUserById } from "../controllers/adminControllers/customerController.js";


const userManagement = (req, res, next) => {
  const { action } = req.body;

  if (action === "block") {
    req.controller = adminBlockUser
  } else if (action === "unblock") {
    req.controller = adminUnBlockUser
  }
  else {
    req.controller = getUserById;
  }

  next();
};

export default userManagement;