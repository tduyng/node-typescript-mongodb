import mongoose from 'mongoose';
import { config } from 'src/config';
import { Logger } from './logger';
export const connectDb = async (): Promise<void> => {
  const db = config.dbUrl;
  try {
    await mongoose.connect(db, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    Logger.info('MongoDB has been connected');
  } catch (err) {
    Logger.error(err.message);
    process.exit(1);
  }
};
