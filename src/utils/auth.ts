import jwt from "jsonwebtoken";
import { IUser } from "../models/user";

interface TokenData {
  username: string;
  email: string;
  _id: string;
  // Add other fields if necessary
}

const secret = process.env.JWT_SECRET || "your_default_secret"; // replace with your actual secret
const expiration = "1h"; // adjust the expiration time as needed

const signToken = (data: TokenData): string => {
  return jwt.sign({ data }, secret, { expiresIn: expiration });
};


export { signToken };
