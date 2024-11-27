import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;

export const hashPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string | undefined
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashedPassword || "");
  return isMatch;
};

export const generateToken = (id: string): string => {
  const payload = { id };
  const options = { expiresIn: "1h" };
  const JWT_SECRET = process.env.JWT_SECRET;

  return jwt.sign(payload, JWT_SECRET!, options);
};
export const generateRefreshToken = (id: string): string => {
  const payload = { id };
  const options = { expiresIn: "7d" };
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
  return jwt.sign(payload, JWT_REFRESH_SECRET!, options);
};
