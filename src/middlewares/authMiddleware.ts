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
    console.error('Unauthorized - Missing token');
    return res.status(401).json({ error: 'Unauthorized - Missing token' });
  }

  // Extract the token from the Authorization header
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.error('Unauthorized - Invalid token format');
    return res.status(401).json({ error: 'Unauthorized - Invalid token format' });
  }

  const token = parts[1];

  if (!token) {
    console.error('Unauthorized - Token is empty');
    return res.status(401).json({ error: 'Unauthorized - Token is empty' });
  }

  try {
    const decoded: any = jwt.verify(token, secret);

    req.user = decoded.data; // Attach the decoded user information to the request
    next();
  } catch (error) {
    console.error({ error: 'Token verification error'});
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

export default verifyToken;
