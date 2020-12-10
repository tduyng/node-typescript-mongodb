import { Logger } from 'src/loaders/logger';
import { expressLoader } from 'src/loaders/express';
import { Application } from 'express';

export default async (app: Application) => {
  Logger.info('Loaders running');

  await expressLoader(app);
  Logger.info('Express loaded');
};
