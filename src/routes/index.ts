import { Router } from 'express';
// import auth from './routes/auth';
import { userRoutes } from 'src/routes/api/user';

export const routes = () => {
  const appRouter = Router();
  // auth(appRouter);
  userRoutes(appRouter);

  return appRouter;
};
