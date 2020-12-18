import winston from 'winston';

//-------------------------------------------------//
//              LOGGER PROD                        //
//-------------------------------------------------//
const customFormat = winston.format.printf(args => {
  const { timestamp, level, message } = args;
  const more: Array<any> | undefined =
    args[(Symbol.for('splat') as unknown) as string];
  const moreMsg = more
    ? more.map(msg =>
        msg instanceof Object ? JSON.stringify(msg, null, 2) : msg.toString(),
      )
    : [];
  return `${timestamp} | ${level}: ${message} ${moreMsg.join(' ')}`;
});

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    customFormat,
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/all.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console());
}

//-------------------------------------------------//
//              LOGGER DEV                         //
//-------------------------------------------------//
const transports = [];
if (process.env.NODE_ENV !== 'development') {
  transports.push(new winston.transports.Console());
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.cli(),
        winston.format.splat(),
      ),
    }),
  );
}

const loggerDev = winston.createLogger({
  level: 'debug',
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports,
});

export { logger, loggerDev };
export default logger;
