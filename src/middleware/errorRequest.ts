import createError from 'http-errors';
import type { ErrorRequestHandler } from 'express';
import httpStatus from 'http-status-codes';

import { logger, loggerDev } from 'src/utils/logger';
import { ErrorRo } from 'src/types/appRo';

/**
 * Error middleware
 * Every error thrown in a route ends up here to be sent to the user
 * They are formatted into a generic RO, to have uniform error replies
 *
 * Not wanted errors (for example, a crash in the route) are
 * converted into a 500 - Internal server errors
 */
const errorRequest: ErrorRequestHandler = (err, req, res, _) => {
  logger.error(err.message);
  // If the error is not an HTTP error, the whole object is printed through console.error
  if (!createError.isHttpError(err)) {
    loggerDev.error(err);
  }
  const status = err.status ?? httpStatus.INTERNAL_SERVER_ERROR;
  res.status(status).send(ErrorRo(status, err.message));
};

export { errorRequest };

export default errorRequest;
