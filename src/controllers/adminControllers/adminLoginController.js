import dotenv from "dotenv";
import { comparePassword } from "../../utils/bcrypt.js";
import { generateToken } from "../../utils/token.js";

dotenv.config()

export const adminLogin = async (req, res) => {
  try {
      const { email, password } = req.body;
      if(password == process.env.ADMIN_PASSWORD && email == process.env.ADMIN_EMAIL){
          const accessToken = generateToken(email);
          return res.status(200).json({username: email, accessToken});
      }else{
          return res.status(500).json({message:`You aren't an admin`});
      }
  } catch (error) {
      res.status(500).json(error.message);
  }
};


