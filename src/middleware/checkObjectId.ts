import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';

export const checkObjectId = (id: string) => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[id])) {
    return res.status(400).json({ msg: 'Invalid id' });
  }
  next();
};
