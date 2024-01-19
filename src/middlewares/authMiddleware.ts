// authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../models/user'; 

const secret = process.env.JWT_SECRET || 'your_default_secret';

interface AuthRequest extends Request {
  user?: IUser; 
}

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized - Missing token' });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token format' });
  }

  try {
    const decoded: any = jwt.verify(token, secret);
    req.user = decoded; // Attach the decoded user information to the request

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

export default verifyToken;
