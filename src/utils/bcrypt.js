import bcrypt from "bcrypt";

export const hashPassword = (password) => {
  const hashedPassword = bcrypt.hash(password, 10);
  return hashedPassword;
};
