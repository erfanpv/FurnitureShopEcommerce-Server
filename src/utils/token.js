import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
  return token;
};
