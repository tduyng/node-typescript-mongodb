import { Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { RequestUser } from 'src/types/user';
import { config } from 'src/config';
import httpStatus from 'http-status-codes';
import handler from 'express-async-handler';
import createError from 'http-errors';

const userAuth: RequestHandler = handler(
  async (req: RequestUser, res: Response, next: NextFunction) => {
    const token = req.header('x-auth-token');
    if (!token) {
      next(
        createError(httpStatus.BAD_REQUEST, 'No token, authorization denied'),
      );
    }

    const jwtSecret = config.jwtSecret;
    jwt.verify(token, jwtSecret, function (err, decoded) {
      if (err) {
        next(createError(httpStatus.BAD_REQUEST, 'Token not valid'));
        return;
      }
      req.user = (decoded as RequestUser).user;
      next();
    });
  },
);

export { userAuth };
