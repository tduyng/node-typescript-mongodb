import express, { Request, Response, NextFunction, Application } from 'express';

import cors from 'cors';
import { routes } from 'src/routes';
import { config } from 'src/config';
import { ExpressError } from 'src/@types/express';
import { Logger } from './logger';

export const expressLoader = (app: Application) => {
  /**
   * Health Check endpoints
   * @TODO Explain why they are here
   */
  app.get('/', (req, res) => {
    res.send('Hi there!');
  });
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Some sauce that always add since 2014
  // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
  // Maybe not needed anymore ?
  app.use(require('method-override')());
  app.use(express.json());

  // Load API routes and using prefix route
  app.use(config.api.prefix, routes());
  Logger.debug(`Prefix route: ${config.api.prefix}`);

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });

  /// error handlers
  app.use(
    (err: ExpressError, req: Request, res: Response, next: NextFunction) => {
      /**
       * Handle 401 thrown by express-jwt library
       */
      if (err.name === 'UnauthorizedError') {
        return res.status(err.status).send({ message: err.message }).end();
      }
      return next(err);
    },
  );
  app.use(
    (err: ExpressError, req: Request, res: Response, next: NextFunction) => {
      res.status(err.status || 500);
      res.json({
        errors: {
          message: err.message,
        },
      });
    },
  );
};
