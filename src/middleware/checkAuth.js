import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Access denied" });
    }

    const tokenValid = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!tokenValid) {
      return res.status(500).json({ message: "Token not valid" });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json(error.message);
  }
};

export default checkAuth;
