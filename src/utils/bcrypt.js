import bcrypt from "bcrypt";

const hashPassword = (password) => {
  const hashedPassword = bcrypt.hash(password, 10);
  return hashedPassword;
};


const comparePassword = async (password, userPassword) => {
  try {
    const comparedPassword = await bcrypt.compare(password, userPassword);
    return comparedPassword; 
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false; 
  }
};



export { hashPassword, comparePassword };
