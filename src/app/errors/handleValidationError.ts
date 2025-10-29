import mongoose from 'mongoose';
import { TGenericErrorResponse, TErrorSources } from './error.interface';

const handleValidationError = (
  err: mongoose.Error.ValidationError
): TGenericErrorResponse => {
  const errorSources: TErrorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => ({
      path: val.path,
      message: val.message,
    })
  );

  return {
    statusCode: 400,
    message: 'Validation Error',
    errorSources,
    code: 'VALIDATION_ERROR',
  };
};

export default handleValidationError;
