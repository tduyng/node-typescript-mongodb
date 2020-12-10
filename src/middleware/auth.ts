import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from 'src/config';

interface RequestUser extends Request {
  user?: any;
}
export const auth = (
  req: RequestUser,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.header('x-auth-token');
  if (!token) {
    res.status(401).json({
      msg: 'No token, authorization denied',
    });
  }

  const jwtSecret = config.jwtSecret;
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
