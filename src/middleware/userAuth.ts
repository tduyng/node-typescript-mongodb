import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RequestUser } from 'src/types/users';
import { config } from 'src/config';
import httpStatus from 'http-status-codes';

export const userAuth = (
  req: RequestUser,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.header('x-auth-token');
  if (!token) {
    res.status(401).json({
      error: {
        message: 'No token, authorization denied',
      },
    });
  }

  const jwtSecret = config.jwtSecret;
  try {
    const decoded = jwt.verify(token, jwtSecret) as RequestUser;
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(httpStatus.BAD_REQUEST).json({
      error: {
        message: 'Token is not valid',
      },
    });
  }
};
