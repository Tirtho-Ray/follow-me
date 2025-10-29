import { ZodError, ZodIssue } from 'zod';
import { TGenericErrorResponse } from './error.interface';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources = err.issues.map((issue: ZodIssue) => {

    let lastPath = issue.path[issue.path.length - 1];


    if (typeof lastPath === 'symbol' || lastPath === undefined) {
      lastPath = 'unknown';
    }

    return {
      path: lastPath as string | number,
      message: issue.message,
    };
  });

  return {
    statusCode: 400,
    message: 'Validation Error',
    errorSources,
    code: 'ZOD_VALIDATION_ERROR',
  };
};

export default handleZodError;
