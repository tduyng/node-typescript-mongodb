import { Logger } from 'src/loaders/logger';
import { expressLoader } from 'src/loaders/express';
import { Application } from 'express';
import { connectDb } from 'src/loaders/mongoose';
export const loaders = async (app: Application): Promise<void> => {
  Logger.info('Loaders running');
  await expressLoader(app);
  await connectDb();

  Logger.info('Express loaded');
};
