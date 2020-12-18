import { Container } from 'typedi';
import { MailerService } from 'src/services/mailer';
import { Logger } from 'winston';

class EmailSequenceJob {
  public async handler(job, done): Promise<void> {
    const logger: Logger = Container.get('logger');
    try {
      logger.debug('EmailSequenceJob triggered');
      const { email }: { [key: string]: string } = job.attrs.data;
      const mailerService = Container.get(MailerService);
      await mailerService.SendWelcomeEmail(email);
      done();
    } catch (error) {
      logger.error(`Error occurred with EmailSequenceJob: ${error}`);
      done(error);
    }
  }
}
export { EmailSequenceJob };
export default EmailSequenceJob;
