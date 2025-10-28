import { NextFunction, Request, Response } from 'express';
import { ZodObject } from 'zod';
import { catchAsync } from '../utils/catchAsync';

const validateRequest = (schema: ZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsedBody = await schema.parseAsync({
      body: req.body,
    });

    req.body = parsedBody.body;

    next();
  });
};

export const validateRequestCookies = (schema: ZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsedCookies = await schema.parseAsync({
      cookies: req.cookies,
    });

    req.cookies = parsedCookies.cookies;

    next();
  });
};

export default validateRequest;
