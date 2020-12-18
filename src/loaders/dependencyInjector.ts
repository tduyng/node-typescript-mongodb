import { Container } from 'typedi';
import { loggerDev } from 'src/utils/logger';
import { config } from 'src/config';
import sgMail from '@sendgrid/mail';
import { IModelDI } from 'src/types/dependencyInjectors';
import { agendaFactory } from './agenda';

const dependencyInjector = async ({
  mongoConnection,
  models,
}: {
  mongoConnection;
  models: IModelDI[];
}) => {
  try {
    models.forEach(m => {
      Container.set(m.name, m.model);
    });
    const agendaInstance = agendaFactory(mongoConnection);

    sgMail.setApiKey(config.emails.apiKey);
    Container.set('agendaInstance', agendaInstance);
    Container.set('logger', loggerDev);
    Container.set('emailClient', sgMail);

    loggerDev.info('Agenda injected into container');
    return agendaInstance;
  } catch (error) {
    loggerDev.error(`Error on dependency injector loader: ${error}`);
    throw error;
  }
};

export { dependencyInjector };
export default dependencyInjector;
