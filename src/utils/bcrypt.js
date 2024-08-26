import bcrypt from "bcrypt";

const hashPassword = (password) => {
  const hashedPassword = bcrypt.hash(password, 10);
  return hashedPassword;
};

const comparePassword = (password, userPassword) => {
  const comparedPassword = bcrypt.compare(password, userPassword);
  return comparedPassword;
};

export { hashPassword, comparePassword };
