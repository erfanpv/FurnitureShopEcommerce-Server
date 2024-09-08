import userDb from "../../models/schemas/userSchema.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await userDb.find({ role: { $ne: "admin" } });
    
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    } 
    
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `Bad request: ${error.message}` });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userDb.findById(userId);
    
    if (!user || user.length === 0) {
      return res.status(404).json({ message: "Users not found" });
    } 
    
    res.status(200).json({success: true,message: "User fetched successfully",data: user,});
  } catch (error) {
    res.status(500).json({ success: false, message: `Bad request: ${error.message}` });
  }
};


export const adminBlockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await userDb.findByIdAndUpdate(userId, {is_blocked: true });
    return res.status(200).json({ success: true ,message: "User blocked success"});
  } catch (error) {
    res.status(500).send({success:false,message:`Internal Server Error ,${error.message}`});
  }
};

export const adminUnBlockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await userDb.findByIdAndUpdate(userId, {is_blocked: false });
    return res.status(200).json({ success: true ,message: "User unblocked success"});
  } catch (err) {
    res.status(500).send({success:false,message:`Internal Server Error ,${error.message}`});
  }
};

