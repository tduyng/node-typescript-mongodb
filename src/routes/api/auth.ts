import { Router, Response } from 'express';
import { RequestUser } from 'src/@types/users';
import { middleware } from 'src/middleware';

const router = Router();

export const authRoutes = (appRouter: Router) => {
  appRouter.use('/auth', router);
};
