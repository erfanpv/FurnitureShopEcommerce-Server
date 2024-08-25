import userDb from "../models/userSchema.js";
import { hashPassword } from "../utils/bcrypt.js";

const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await userDb.findOne({ email });
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (existingUser) {
      return res.status(409).json({ message: `User already exist` });
    } else if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    } else if (
      firstName.length === 0 ||
      lastName.length === 0 ||
      password.length === 0
    ) {
      return res.status(400).json({ message: "Space only doesn't support" });
    } else if (!emailFormat.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    const hashedPassword = await hashPassword(password);

    const user = new userDb({ firstName, lastName, email, password:hashedPassword });
    await user.save();
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    return res.status(400).json({ message: `Bad request:  ${error.message}` });
  }
};

export { signUp };
