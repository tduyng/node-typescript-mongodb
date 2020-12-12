import 'reflect-metadata'; // We need this in order to use @Decorators
import express, { Application } from 'express';
import { config } from 'src/config';
import { Logger } from 'src/loaders/logger';

const startServer = async () => {
  const app: Application = express();

  /**
   * A little hack here
   * Import/Export can only be used in 'top-level code'
   * Well, at least in node 10 without babel and at the time of writing
   * So we are using good old require.
   **/
  await require('src/loaders').default(app);
  app
    .listen(config.port, () => {
      Logger.info(`Server listening on port: ${config.port}`);
    })
    .on('error', err => {
      Logger.error(err);
      process.exit(1);
    });
};

console.log('Hi there!');
startServer();
