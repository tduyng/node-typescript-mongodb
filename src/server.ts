import 'reflect-metadata'; // We need this in order to use @Decorators
import express, { Application } from 'express';
import { config } from 'src/config';
import { Logger } from 'src/loaders/logger';
import { loaders } from 'src/loaders';

const startServer = async () => {
  const app: Application = express();
  await loaders(app);
  app
    .listen(config.port, () => {
      Logger.info(`Server listening on port: ${config.port}`);
    })
    .on('error', err => {
      Logger.error(err);
      process.exit(1);
    });
};

startServer();
