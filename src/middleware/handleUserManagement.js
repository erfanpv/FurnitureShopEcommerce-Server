import { adminBlockUser, adminUnBlockUser, getUserById } from "../controllers/adminControllers/customerController.js";


const userManagement = (req, res, next) => {
  try {
    const { action } = req.body;

    if (action === "block") {
      req.controller = adminBlockUser;
    } else if (action === "unblock") {
      req.controller = adminUnBlockUser;
    } else {
      req.controller = getUserById;
    }

    next();
  } catch (error) {
    res.send(500).json({ success: false, message: `Bad request ${error.message}` });
  }
};


export default userManagement

