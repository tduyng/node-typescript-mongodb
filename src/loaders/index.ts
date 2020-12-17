import { loggerDev } from 'src/utils/logger';
import { expressLoader } from 'src/loaders/express';
import { Application } from 'express';
import { connectDb } from 'src/loaders/mongoose';
import { UserModel } from 'src/models/users';
import { IModelDI } from 'src/types/dependencyInjectors';
import { dependencyInjector } from './dependencyInjector';

export const loaders = async (app: Application): Promise<void> => {
  loggerDev.info('Loaders running');
  const mongoConnection = await connectDb();
  const userModel: IModelDI = {
    name: 'userModel',
    model: UserModel,
  };

  dependencyInjector({
    mongoConnection,
    models: [
      userModel, // whateverModel
    ],
  });
  loggerDev.info('Dependency Injector loaded');

  expressLoader(app);
};
