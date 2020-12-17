import mongoose from 'mongoose';
import { IUser } from 'src/types/user';
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Please enter a username'],
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, 'Please enter an email'],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
  },
  { timestamps: true },
);

const UserModel = mongoose.model<IUser & mongoose.Document>('user', UserSchema);

export { UserModel };
export default UserModel;
