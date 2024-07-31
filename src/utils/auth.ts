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
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET || "your_refresh_secret"; // replace with your actual refresh secret
const refreshExpiration = "7d"; // adjust the refresh token expiration time as needed

// const signToken = (data: TokenData, options = {}): string => {
//   return jwt.sign({ data }, secret, { expiresIn: expiration, ...options });
// };

const signToken = (data: TokenData, options ={}) => {
  const secret = process.env.JWT_SECRET || 'your_default_secret';
  const expiration = '1h'; // or '7d' for refresh tokens

  return jwt.sign({ data }, secret, { expiresIn: expiration });
};

const signRefreshToken = (data: TokenData): string => {
  return jwt.sign({ data }, refreshTokenSecret, { expiresIn: refreshExpiration });
};

const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, refreshTokenSecret);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

export { signToken, signRefreshToken, verifyRefreshToken };
