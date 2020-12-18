import { Container } from 'typedi';
import { loggerDev } from 'src/utils/logger';
import { config } from 'src/config';
import sgMail from '@sendgrid/mail';
import { IModelDI } from 'src/types/dependencyInjectors';

const dependencyInjector = async ({
  models,
}: {
  models: IModelDI[];
}): Promise<void> => {
  try {
    models.forEach(m => {
      Container.set(m.name, m.model);
    });

    sgMail.setApiKey(config.emails.apiKey);
    Container.set('logger', loggerDev);
    Container.set('emailClient', sgMail);
  } catch (error) {
    loggerDev.error(`Error on dependency injector loader: ${error}`);
    throw error;
  }
};

export { dependencyInjector };
export default dependencyInjector;
