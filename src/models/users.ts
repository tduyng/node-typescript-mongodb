import mongoose from 'mongoose';
import { IUser } from 'src/types/users';
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

UserSchema.path('email').validate(function (email) {
  const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(email.text); // Assuming email has a text attribute
}, 'Email field cannot be empty.');

UserSchema.path('username').validate(function (username) {
  const usernameRegex = /^(\s)?$/;
  return usernameRegex.test(username.text); // Assuming username has a text attribute
}, 'User field cannot be empty.');

export const UserModel = mongoose.model<IUser & mongoose.Document>(
  'user',
  UserSchema,
);
