import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Service, Inject } from 'typedi';
import { EventSubscriber } from 'src/subscribers/event';

@Service()
export class AuthService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    private mailer: MailerService,
    @Inject('logger') private logger,
    @Event
  ) {}
}
