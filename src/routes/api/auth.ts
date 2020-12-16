import { Router, Request, Response, NextFunction } from 'express';
import { IUserInput, RequestUser } from 'src/@types/users';
import { middleware } from 'src/middleware';
import { AuthService } from 'src/services/auth';
import { check, validationResult } from 'express-validator';
import { Container } from 'typedi';

const router = Router();

export const authRoutes = (appRouter: Router) => {
  appRouter.use('/auth', router);

  // @GET '/auth'
  // @DEST Get user authenticated

  router.get(
    '/',
    middleware.auth,
    async (req: RequestUser, res: Response, next: NextFunction) => {
      try {
        // user.req always get from middleware
        const authService = Container.get(AuthService);
        const user = await authService.getUser(req.user.id);
        res.json(user);
      } catch (error) {
        next();
      }
    },
  );

  // @POST '/auth'
  // @DES Login user
  router.post(
    '/',
    [
      check('username', 'Username is required').not().isEmpty(),
      check('password', 'Please enter your password').not().isEmpty(),
    ],
    async (
      req: RequestUser,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      try {
        const authService = Container.get(AuthService);
        const token = await authService.loginUser(req.user);
        res.json({ token });
      } catch (error) {
        res.status(500).json({ errors: error });
        next();
      }
    },
  );

  // @POST '/auth/users'
  // @DES Register user
  router.post(
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
    async (
      req: RequestUser,
      res: Response,
      next: NextFunction,
    ): Promise<void> => {
      const errors = validationResult(req);

      if (!errors.isEmpty) {
        res.status(400).json({ errors: errors.array() });
        next();
        return;
      }

      try {
        const userInput = req.body as IUserInput;
        const authService = Container.get(AuthService);
        const token = await authService.registerUser(userInput);
        res.json({ token });
      } catch (error) {
        res.status(500).json({ errors: error });
        next();
      }
    },
  );
};
