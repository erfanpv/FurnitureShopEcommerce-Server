import dotenv from "dotenv";
import { comparePassword } from "../../utils/bcrypt.js";
import { generateToken } from "../../utils/token.js";
import userDb from "../../models/schemas/userSchema.js";

dotenv.config()

export const adminLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const admin = await userDb.findOne({ email });
  
      if (!admin) {
        return res.status(400).json({ success: false, message: "Invalid User. Create an account" });
      }
  
      const validUser = comparePassword(password, admin.password);
  
      if (!validUser) {
        return res.status(400).json({ success: false, message: "Incorrect password/username" });
      }
  
      if (admin.role === "admin") {
        const token = generateToken(admin.id);
  
       return res.status(200).json({
          success: true,
          message: "Admin logged in successfully",
          email: admin.email,
          password: admin.password,
          token,
        });
      }else{
          res.status(400).json({success:false,message:"Access Denied: You are not an admin"})
      }
    } catch (error) {
      res.status(500).json({ success: false, message: `Bad request: ${error.message}` });
    }
  };


