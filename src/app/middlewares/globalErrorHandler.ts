/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import { TErrorSources, TGenericErrorResponse } from '../interface/error.interface';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/appError';
import handleZodError from '../errors/hendleZoddError';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorSources: TErrorSources = [{ path: '', message }];
  let code: string | undefined;

  if (err instanceof ZodError) {
    const simplified = handleZodError(err);
    ({ statusCode, message, errorSources, code } = simplified);
  } else if (err?.name === 'ValidationError') {
    const simplified = handleValidationError(err);
    ({ statusCode, message, errorSources, code } = simplified);
  } else if (err?.name === 'CastError') {
    const simplified = handleCastError(err);
    ({ statusCode, message, errorSources, code } = simplified);
  } else if (err?.code === 11000) {
    const simplified = handleDuplicateError(err);
    ({ statusCode, message, errorSources, code } = simplified);
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [{ path: '', message }];
    code = 'APP_ERROR';
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [{ path: '', message }];
    code = 'INTERNAL_ERROR';
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    code,
    stack: config.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default globalErrorHandler;
