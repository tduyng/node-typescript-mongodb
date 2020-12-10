import { Request } from 'express';

interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  salt: string;
}
interface IUserInputDTO {
  name: string;
  email: string;
  password: string;
}

interface RequestUser extends Request {
  user?: any;
}
