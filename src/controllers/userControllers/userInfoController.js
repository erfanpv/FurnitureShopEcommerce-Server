import userDb from "../../models/schemas/userSchema.js";
export const getUserInfo = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userDb.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User Information
export const updateUserInfo = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { firstName, lastName, email, phone } = req.body;
    console.log(req.body)
    const updatedUser = await userDb.findByIdAndUpdate(
      userId,
      { firstName, lastName, email, phone },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
