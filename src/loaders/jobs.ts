// import { config } from '../config';
// import { EmailSequenceJob } from 'src/jobs/emailSequence';
import Agenda from 'agenda';

export const jobsLoader = async (agenda: Agenda) => {
  // agenda.define(
  //   'send-email',
  //   { priority: 'high', concurrency: config.agenda.concurrency },
  //   new EmailSequenceJob().handler,
  // );
  agenda.define('printAnalyticsReport', async job => {
    console.log('I print a report!');
  });

  agenda.start();
  agenda.every('10s', 'printAnalyticsReport');
};
