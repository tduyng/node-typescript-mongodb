import mongoose from 'mongoose';
import { config } from 'src/config';
import { loggerDev } from '../utils/logger';
export const mongooseLoader = async () => {
  const db = config.dbUrl;
  try {
    const mongoConnection = await mongoose.connect(db, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    loggerDev.info('MongoDB has been connected');
    return mongoConnection.connection.db;
  } catch (err) {
    loggerDev.error(err.message);
    process.exit(1);
  }
};
