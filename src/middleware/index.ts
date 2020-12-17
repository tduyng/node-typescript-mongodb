import { userAuth } from './userAuth';
import { checkObjectId } from './checkIdMongo';
import { requestLogger } from './requestLogger';
import { notFound } from './notFound';
import { errorRequest } from './errorRequest';
import { validation } from './validation';

export const middleware = {
  userAuth,
  checkObjectId,
  requestLogger,
  notFound,
  errorRequest,
  validation,
};
