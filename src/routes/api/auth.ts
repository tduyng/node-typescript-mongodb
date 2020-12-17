import { Router, Response } from 'express';
import { IUserInput, RequestUser } from 'src/types/users';
import { middleware } from 'src/middleware';
import { AuthService } from 'src/services/auth';
import { check, validationResult } from 'express-validator';
import { Container } from 'typedi';
import { Logger } from 'winston';
import { config } from 'src/config';
import handler from 'express-async-handler';

const authRouter = Router();

// @GET '/auth'
// @DEST Get user authenticated

authRouter.get(
  '/',
  middleware.userAuth,
  handler(async (req: RequestUser, res: Response) => {
    const logger: Logger = Container.get('logger');
    logger.debug(`Calling GET route ${config.api.prefix}/auth`);
    try {
      // user.req always get from middleware
      const authService = Container.get(AuthService);
      const user = await authService.getUser(req.user.id);
      res.json(user);
    } catch (error) {
      logger.error('Error route getUser', error.message);
    }
  }),
);

// @POST '/auth'
// @DES Login user
authRouter.post(
  '/',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Please enter your password').not().isEmpty(),
  ],
  handler(
    async (req: RequestUser, res: Response): Promise<void> => {
      const logger: Logger = Container.get('logger');
      logger.debug(`Calling POST route ${config.api.prefix}/auth`);
      const errors = validationResult(req);

      if (!errors.isEmpty) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      try {
        const authService = Container.get(AuthService);
        const token = await authService.loginUser(req.body);

        res.json({ token });
      } catch (error) {
        res.status(500).json({ errors: error });
      }
    },
  ),
);

// @POST '/auth/users'
// @DES Register user
authRouter.post(
  '/users',
  // Using express-validator to check form input
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 3 or more characters',
    ).isLength({ min: 3 }),
  ],
  handler(
    async (req: RequestUser, res: Response): Promise<void> => {
      const logger: Logger = Container.get('logger');
      logger.debug(`Calling POST route ${config.api.prefix}/auth/users`);
      const errors = validationResult(req);

      if (!errors.isEmpty) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      try {
        const userInput = req.body as IUserInput;
        const authService = Container.get(AuthService);
        const token = await authService.registerUser(userInput);
        res.json({ token });
      } catch (error) {
        res.status(500).json({ errors: error });
      }
    },
  ),
);

export { authRouter };
export default authRouter;
