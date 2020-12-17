import { IUser } from 'src/types/user';
import { Service, Inject } from 'typedi';
import { Logger } from 'winston';
import { Container } from 'typedi';
import { config } from 'src/config';

@Service()
export class MailerService {
  constructor(@Inject('emailClient') private emailClient) {}
  Logger: Logger = Container.get('logger');
  public async SendWelcomeEmail(email: string) {
    /*
     * @TODO Call Mailchip/ Sendgrid or whaterver mail service
     */

    // Add example for sending mail from sendgrid
    const msg = {
      from: config.emails.sender,
      to: email,
      subject: 'Welcome to our page',
      text: 'Sending with SENDGRID is fun!',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    this.emailClient
      .send(msg)
      .then(() => {
        this.Logger.info(`An email has been send to ${email}`);
      })
      .catch(error => {
        this.Logger.error(`Sendgrid: ${error}`);
      });

    return { delivered: 1, status: 'ok' };
  }

  public StartEmailSequence(sequence: string, user: Partial<IUser>) {
    if (!user.email) {
      throw new Error('No email provided');
    }
    // @TODO Add example of an email sequence implementation
    // Something like
    // 1 - Send first email of the sequence
    // 2 - Save the step of the sequence in database
    // 3 - Schedule job for second email in 1-3 days or whatever
    // Every sequence can have its own behavior so maybe
    // the pattern Chain of Responsibility can help here.
    return { delivered: 1, status: 'ok' };
  }
}
