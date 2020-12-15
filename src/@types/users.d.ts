import { Request } from 'express';

interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
}
interface IUserInputDTO {
  username?: string;
  email?: string;
  password: string;
}

interface RequestUser extends Request {
  user?: IUserInputDTO;
}
