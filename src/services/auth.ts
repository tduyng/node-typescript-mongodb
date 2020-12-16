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

@Service()
export class AuthService {
  constructor(
    @Inject('userModel')
    private userModel: mongoose.Model<IUser & mongoose.Document>,
    private mailer: MailerService,
    @Inject('logger')
    private logger,
    @EventDispatcher()
    private eventDispatcher: EventDispatcherInterface,
  ) {}

  public async getUser(id: string): Promise<IUser> {
    try {
      const user = await this.userModel.findById(id).select('-password');
      return user;
    } catch (error) {
      throw new Error('Can not get user!');
    }
  }

  public async loginUser(Req: RequestUser) {
    const userReq: IUserInput = Req.user; // get user from request
    if (!userReq) {
      throw new Error('Error login user,');
    }
    // Get user from db
    const user =
      (await this.userModel.findOne({ username: userReq.username })) ||
      (await this.userModel.findOne({ email: userReq.email }));
    if (!user) {
      throw new Error('Invalid  credentials');
    }
    // Check password
    try {
      const isMatch = await bcrypt.compare(userReq.password, user.password);
      if (!isMatch) {
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
        return token;
      });
    } catch (error) {
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

        return token;
      } catch (error) {
        throw new Error('RegisterUser: Error jsonwebtoken');
      }
    } catch (error) {
      throw new Error('Error registerUser');
    }
  }
}
