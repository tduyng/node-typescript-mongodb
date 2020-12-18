import express, { Application } from 'express';
import cors from 'cors';
import { appRouter } from 'src/routes';
import { config } from 'src/config';
import helmet from 'helmet';
import { middleware } from 'src/middleware';
import { agendashRouterDirect } from 'src/routes/agendash';

export const expressLoader = async (app: Application) => {
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

  /* Middleware*/
  app.use(middleware.requestLogger);
  app.use(cors({ origin: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(helmet());

  /*  Proxy rules */
  app.set('trust proxy', true);

  /*  Routes  */
  app.use(config.api.prefix, appRouter);
  agendashRouterDirect(app);

  /*  404 middleware  */
  app.use(middleware.notFound);

  /*  Error middleware  */
  app.use(middleware.errorRequest);
};
