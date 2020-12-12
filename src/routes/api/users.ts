import { Router, Response } from 'express';
import { RequestUser } from 'src/@types/users';
import { middleware } from 'src/middleware';

const router = Router();

export const userRoutes = (appRouter: Router) => {
  appRouter.use('/users', router);

  router.get('/me', middleware.auth, (req: RequestUser, res: Response) => {
    return res.status(200).json({ user: req.user });
  });
};
