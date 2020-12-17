import { Router } from 'express';
import { userRouter } from './api/user';
const appRouter = Router();

appRouter.use('/users', userRouter);

export { appRouter };
export default appRouter;
