import { Router, Response } from 'express';
import { RequestUser } from 'src/types/users';
import { middleware } from 'src/middleware';
import handler from 'express-async-handler';

const userRouter = Router();

userRouter.get(
  '/me',
  middleware.userAuth,
  handler(async (req: RequestUser, res: Response) => {
    return res.status(200).json({ user: req.user });
  }),
);

export { userRouter };
export default userRouter;
