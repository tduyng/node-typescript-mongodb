import { Service, Inject } from 'typedi';
import { EventSubscriber } from 'src/subscribers/event';
import { MailerService } from 'src/services/mailer';
import { config } from 'src/config';
import { IUser, RequestUser, IUserInput } from 'src/@types/users';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'src/decorators/eventDispatcher';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

@Service()
export class AuthService {
  constructor(
    @Inject('userModel')
    private userModel: mongoose.Model<IUser & mongoose.Document>,
    private mailer: MailerService,
    @Inject('logger') private logger,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
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
    const userReq: IUserInput = Req.user;
    if (!userReq) {
      throw new Error('Error login user,');
    }
    const user =
      (await this.userModel.findOne({ username: userReq.username })) ||
      (await this.userModel.findOne({ email: userReq.email }));
    if (!user) {
      throw new Error('Invalid  credentials');
    }
    try {
      const isMatch = await bcrypt.compare(userReq.password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw new Error('Error login user!');
    }
  }
}
