import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import mongoose from 'mongoose';
import { Logger } from 'winston';
import { AppEvents } from './event';
import { IUser } from 'src/types/user';

@EventSubscriber()
export default class UserSubscriber {
  /**
   * A example
   * save the last time a user signin, your boss will be pleased.
   *
   * Altough it works in this tiny toy API, please don't do this for a production product
   * just spamming insert/update to mongo will kill it eventualy
   *
   * Use another approach like emit events to a queue (rabbitmq/aws sqs),
   * then save the latest in Redis/Memcache or something similar
   */
  @On(AppEvents.user.signIn)
  public async onUserSignIn({ id, username }: Partial<IUser>) {
    const Logger: Logger = Container.get('logger');

    try {
      const UserModel = Container.get('userModel') as mongoose.Model<
        IUser & mongoose.Document
      >;

      UserModel.update({ id }, { $set: { lastLogin: new Date() } });
      Logger.info(`======> User '${username}' has been connected`);
    } catch (e) {
      Logger.error(`🔥 Error on event ${AppEvents.user.signIn}: %o`, e);

      // Throw the error so the process die (check src/app.ts)
      throw e;
    }
  }

  @On(AppEvents.user.signUp)
  public async onUserSignUp({ username, email }: Partial<IUser>) {
    const Logger: Logger = Container.get('logger');

    try {
      /**
       * @TODO implement this
       */
      // Call the tracker tool so your investor knows that there is a new signup
      // and leave you alone for another hour.
      // TrackerService.track('user.signup', { email, _id })
      // Start your email sequence or whatever
      // MailService.startSequence('user.welcome', { email, name })
      Logger.info(
        `======> New user has been registered: ${username} - ${email}`,
      );
    } catch (e) {
      Logger.error(`🔥 Error on event ${AppEvents.user.signUp}: %o`, e);

      // Throw the error so the process dies (check src/app.ts)
      throw e;
    }
  }
}
