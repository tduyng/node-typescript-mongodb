import { Service, Inject } from 'typedi';
import { AppEvents } from 'src/subscribers/event';
import { MailerService } from 'src/services/mailer';
import { config } from 'src/config';
import { IUser, RequestUser, IUserInput } from 'src/@types/users';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'src/decorators/eventDispatcher';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Logger } from 'winston';

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
    @Inject('logger')
    private logger: Logger,
    @EventDispatcher()
    private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async getUser(id: string): Promise<IUser> {
    try {
      const user = await this.userModel.findById(id).select('-password');
      this.logger.info('Succes getUser');
      return user;
    } catch (error) {
      this.logger.error(`Error getUser: ${error.message}`);
      throw new Error('Can not get user!');
    }
  }

  public async loginUser(userInput: IUserInput) {
    try {
      // Get user from db
      const user =
        (await this.userModel.findOne({ username: userInput.username })) ||
        (await this.userModel.findOne({ email: userInput.email }));
      if (!user) {
        this.logger.debug('Warning loginUser: InValid credentials');
        throw new Error('Invalid  credentials');
      }
      // Check password
      const isMatch = await bcrypt.compare(userInput.password, user.password);
      if (!isMatch) {
        this.logger.debug('Warning loginUser: InValid credentials');
        throw new Error('Invalid credentials');
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
        this.logger.info('Success loginUser');
        return token;
      });
    } catch (error) {
      this.logger.error(`Error loginUser: ${error.message}`);
      throw new Error('Error login user!');
    }
  }

  public async registerUser(userInput: IUserInput) {
    const { username, email, password } = userInput;
    try {
      const user =
        (await this.userModel.findOne({ username })) ||
        (await this.userModel.findOne({ email }));

      if (user) {
        this.logger.debug('Warning registerUser: User existed already');
        throw new Error('User existed already');
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
        const token = await jwt.sign(payload, jwtSecret, { expiresIn: '2h' });
        await this.mailer.SendWelcomeEmail(userRecord.email);
        this.eventDispatcher.dispatch(AppEvents.user.signUp, {
          user: userRecord,
        });
        this.logger.info('Success registerUser');
        return token;
      } catch (error) {
        this.logger.error(`Error registerUser: ${error.message}`);
        throw new Error('RegisterUser: Error jsonwebtoken');
      }
    } catch (error) {
      this.logger.error(`Error registerUser: ${error.message}`);
      throw new Error('Error registerUser');
    }
  }
}
