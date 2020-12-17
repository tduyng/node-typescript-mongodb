import 'reflect-metadata'; // We need this in order to use @Decorators
import express, { Application } from 'express';
import { config } from 'src/config';
import { logger } from 'src/utils/logger';
import { loaders } from 'src/loaders';

const startServer = async () => {
  const app: Application = express();
  await loaders(app);
  app
    .listen(config.port, () => {
      logger.info(`Server listening on port: ${config.port}`);
    })
    .on('error', err => {
      logger.error(err);
      process.exit(1);
    });
};

startServer();
