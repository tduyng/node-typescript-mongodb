import { Router } from 'express';
import { userRouter } from './api/users';
import { authRouter } from './api/auth';
const appRouter = Router();

appRouter.use('/users', userRouter);
appRouter.use('/auth', authRouter);

export { appRouter };
export default appRouter;
