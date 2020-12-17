import mongoose from 'mongoose';
import { config } from 'src/config';
import { loggerDev } from '../utils/logger';
export const connectDb = async (): Promise<void> => {
  const db = config.dbUrl;
  try {
    await mongoose.connect(db, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    loggerDev.info('MongoDB has been connected');
  } catch (err) {
    loggerDev.error(err.message);
    process.exit(1);
  }
};
