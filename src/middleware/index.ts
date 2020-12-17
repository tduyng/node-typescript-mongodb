import { userAuth } from './userAuth';
import { checkObjectId } from './checkIdMongo';
import { requestLogger } from './requestLogger';
import { notFound } from './notFound';
import { errorRequest } from './errorRequest';

export const middleware = {
  userAuth,
  checkObjectId,
  requestLogger,
  notFound,
  errorRequest,
};
