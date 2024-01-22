import jwt from "jsonwebtoken";
import { IUser } from "../models/user";
import mongoose from 'mongoose';

interface TokenData {
  username: string;
  email: string;
  _id: string;
  bookmarkedCardIds: string[] | null;
}

const secret = process.env.JWT_SECRET || "your_default_secret"; // replace with your actual secret
const expiration = "1h"; // adjust the expiration time as needed

const signToken = (data: TokenData): string => {
  return jwt.sign({ data }, secret, { expiresIn: expiration });
};


export { signToken };
