import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.JWT_SECRET || 'mysecret';
const expiration = '2h';

interface JwtPayload {
  _id: unknown;
  username: string;
  email: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

  const secretKey = process.env.JWT_SECRET_KEY || '';

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      req.user = user as JwtPayload;
      return next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || '';

  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

export const authMiddleware = ({ req }: { req: any }) => {
  // Get token from header
  let token = req.headers.authorization || '';

  // Remove "Bearer " prefix if present
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trim();
  }

  const secretKey = process.env.JWT_SECRET_KEY || '';

  if (!token) {
    return { req };
  }

  try {
    const user = jwt.verify(token, secretKey) as JwtPayload;
    req.user = user;
    return { req, user };
  } catch (err) {
    console.warn('Invalid token', err);
    return { req };
  }
};
