import { Request } from 'express';

interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
}
interface IUserInput {
  username?: string;
  email?: string;
  password: string;
}

interface RequestUser extends Request {
  user?: IUserInput;
}
