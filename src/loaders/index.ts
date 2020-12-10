import { Logger } from 'src/loaders/logger';
import { expressLoader } from 'src/loaders/express';
import {} from 'src/loaders/express';
export default async ({ expressApp }) => {
  Logger.info('Loaders running');

  await expressLoader({ app: expressApp });
  Logger.info('Express loaded');
};
