import { Service, Inject } from 'typedi';
import { AppEvents } from 'src/subscribers/event';
import { MailerService } from 'src/services/mailer';
import { config } from 'src/config';
import { IUser, IUserInput } from 'src/types/users';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'src/decorators/eventDispatcher';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import createError from 'http-errors';
import { logger } from 'src/utils/logger';

interface IAuthService {
  getUser: (id: string) => Promise<IUser>;
  loginUser: (userInput: IUserInput) => Promise<any>;
  registerUser: (userInput: IUserInput) => Promise<any>;
}
@Service()
export class AuthService implements IAuthService {
  constructor(
    @Inject('userModel')
    private userModel: mongoose.Model<IUser & mongoose.Document>,
    private mailer: MailerService,
    @EventDispatcher()
    private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async getUser(id: string): Promise<IUser> {
    try {
      const user = await this.userModel.findById(id).select('-password');
      return user;
    } catch (error) {
      throw createError(httpStatus.NOT_FOUND, `User ${id} doesn't exist`);
    }
  }

  public async loginUser(userInput: IUserInput) {
    try {
      // Get user from db
      const user =
        (await this.userModel.findOne({ username: userInput.username })) ||
        (await this.userModel.findOne({ email: userInput.email }));
      if (!user) {
        logger.debug('Warning loginUser: InValid credentials');
        throw createError(httpStatus.FORBIDDEN, `Invalid  credentials`);
      }
      // Check password
      const isMatch = await bcrypt.compare(userInput.password, user.password);
      if (!isMatch) {
        logger.debug('Warning loginUser: InValid credentials');
        throw createError(httpStatus.FORBIDDEN, `Invalid  credentials`);
      }

      //Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      const jwtSecret = config.jwtSecret;
      jwt.sign(payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
        if (err) throw new Error('LoginUser: Error jsonwebtoken');
        this.eventDispatcher.dispatch(AppEvents.user.signUp, {
          user,
        });
        logger.info('Success loginUser');
        return token;
      });
    } catch (error) {
      logger.error(`Error loginUser: ${error.message}`);
      throw createError(httpStatus.FORBIDDEN, `Error login user!`);
    }
  }

  public async registerUser(userInput: IUserInput) {
    const { username, email, password } = userInput;
    try {
      const user =
        (await this.userModel.findOne({ username })) ||
        (await this.userModel.findOne({ email }));

      if (user) {
        logger.debug('Warning registerUser: User existed already');
        throw createError(
          httpStatus.CONFLICT,
          `A user with username ${username} or email ${email} already exists`,
        );
      }
      // Encrypting password
      const salt = await bcrypt.genSalt(10);
      const encryptPass = await bcrypt.hash(password, salt);
      const userRecord = await this.userModel.create({
        username,
        email,
        password: encryptPass,
      });
      // Return password
      const payload = {
        user: {
          id: user.id,
        },
      };
      const jwtSecret = config.jwtSecret;
      try {
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '2h' });
        await this.mailer.SendWelcomeEmail(userRecord.email);
        this.eventDispatcher.dispatch(AppEvents.user.signUp, {
          user: userRecord,
        });
        logger.info('Success registerUser');
        return token;
      } catch (error) {
        logger.error(`Error registerUser: ${error.message}`);
        throw createError(
          httpStatus.FORBIDDEN,
          `RegisterUser: Error jsonwebtoken`,
        );
      }
    } catch (error) {
      logger.error(`Error registerUser: ${error.message}`);
      throw createError(httpStatus.FORBIDDEN, `Error registerUser`);
    }
  }
}
