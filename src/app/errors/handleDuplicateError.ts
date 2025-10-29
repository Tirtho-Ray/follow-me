import { TGenericErrorResponse, TErrorSources } from './error.interface';

/* eslint-disable @typescript-eslint/no-explicit-any */
const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const match = err.message.match(/"([^"]*)"/);
  const value = match ? match[1] : 'Value';

  const errorSources: TErrorSources = [
    {
      path: '',
      message: `${value} already exists`,
    },
  ];

  return {
    statusCode: 400,
    message: `${value} already exists`,
    errorSources,
    code: 'DUPLICATE_VALUE',
  };
};

export default handleDuplicateError;
