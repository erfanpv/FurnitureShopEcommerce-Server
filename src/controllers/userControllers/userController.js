import userDb from "../../models/schemas/userSchema.js";
import { comparePassword, hashPassword } from "../../utils/bcrypt.js";
import { generateToken } from "../../utils/token.js";

export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await userDb.findOne({ email });
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


    if (existingUser) {
      return res.status(409).json({ message: `User already exist` });
    } else if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    } else if (
      firstName.length === 0 ||
      lastName.length === 0 ||
      password.length === 0
    ) {
      return res.status(400).json({ message: "Space not support" });
    } else if (!emailFormat.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }else if (!passwordFormat.test(password)) {
      return res.status(400).json({ message: "Password not Strong" });
    }

    const hashedPassword = await hashPassword(password);

    const user = new userDb({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    return res.status(400).json({ message: `Bad request:  ${error.message}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userDb.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Create new Account" });
    }

    const validPassword = await comparePassword(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or Password" });
    }

    const token = generateToken(user._id);
    return res.status(200).json({ user: user.lastName, token });
  } catch (error) {
    console.log(`Error fetching users ${error}`);
    res.status(500).send("Error logging in user");
  }
};
