import userDb from "../../models/schemas/userSchema.js";
import { comparePassword,hashPassword } from "../../utils/bcrypt.js";
import { generateToken } from "../../utils/token.js";
import { logActivity } from "../baseControllers/logActivity.js";


export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password,role } = req.body;
    const existingUser = await userDb.findOne({ email });
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (existingUser) {
      return res.status(409).json({success:false, message: `User already exist`});
    } else if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({success:false, message: "All fields are required." });
    } else if (
      firstName.length === 0 ||
      lastName.length === 0 ||
      password.length === 0
    ) {
      return res.status(400).json({success:false, message: "Space not support" });
    } else if (!emailFormat.test(email)) {
      return res.status(400).json({ success:false,message: "Invalid email address" });
    }else if (!passwordFormat.test(password)) {
      return res.status(400).json({success:false, message: "Password not Strong" });
    }

    const hashedPassword = await hashPassword(password);

    const user = new userDb({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role ||"user"
    });

    await user.save();
    await logActivity(`User ${user.firstName + " " + user.lastName} registered`);
    return res.status(200).json({success:true, message: "Success", data:user});
  } catch (error) {
    return res.status(400).json({success:false, message: `Bad request:  ${error.message}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userDb.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid User. Create an account" });
    }

    const validUser = await comparePassword(password, user.password);

    if (!validUser) {
      return res.status(401).json({ success: false, message: "Invalid email or Password" });
    }
  
    const token = generateToken(user._id);

     res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    if (user?.role === "admin") {
      return res.status(200).json({ success: true, message: "Admin logged in successfully",data: { user: user, token} });
    } else {
      return res.status(200).json({ success: true, message: "User Logged Success", data: { user: user, token} });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: `Bad request: ${error.message}` });
  }
};
