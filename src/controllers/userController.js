import userDb from "../models/userSchema.js";

const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = new userDb({ firstName, lastName, email, password });
    await user.save();
    return res.status(200).json({ message: "Success" });
  } catch (error) {
    return res.status(400).json({ message: `Bad request:  ${error.message}` });
  }
};

export { signUp };
