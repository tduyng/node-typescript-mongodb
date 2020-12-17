import { Request } from 'express';

export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
}
export interface IUserInput {
  id?: string;
  username?: string;
  email?: string;
  password: string;
}

export interface RequestUser extends Request {
  user?: IUserInput;
}
