import { Request } from 'express';

interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
}
interface IUserInput {
  id?: string;
  username?: string;
  email?: string;
  password: string;
}

interface RequestUser extends Request {
  user?: IUserInput;
}
