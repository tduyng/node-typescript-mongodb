import { loggerDev } from 'src/utils/logger';
import { expressLoader } from 'src/loaders/express';
import { Application } from 'express';
import { mongooseLoader } from 'src/loaders/mongoose';
import { UserModel } from 'src/models/users';
import { IModelDI } from 'src/types/dependencyInjectors';
import { dependencyInjector } from './dependencyInjector';
import './events';

export const loaders = async (app: Application): Promise<void> => {
  loggerDev.info('Loaders running');
  await mongooseLoader();
  const userModel: IModelDI = {
    name: 'userModel',
    model: UserModel,
  };

  await dependencyInjector({
    models: [
      userModel, // whateverModel
    ],
  });
  loggerDev.info('Dependency Injector loaded');
  loggerDev.info('Jobs loaded');

  await expressLoader(app);
};
