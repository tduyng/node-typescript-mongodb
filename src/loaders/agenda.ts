import Agenda from 'agenda';
import { config } from 'src/config';

const agendaFactory = mongoConnection => {
  return new Agenda({
    mongo: mongoConnection,
    db: {
      collection: config.agenda.dbCollection,
    },
    processEvery: config.agenda.pooltime,
  });
};
export { agendaFactory };
export default agendaFactory;
