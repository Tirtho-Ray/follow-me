import { NextFunction, Request, Response } from 'express';
import { ZodObject } from 'zod';
import { catchAsync } from '../utils/catchAsync';

const validateRequest = (schema: ZodObject<any>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsedBody = await schema.parseAsync(req.body); 
    req.body = parsedBody; 
    next();
  });
};

export const validateRequestCookies = (schema: ZodObject<any>) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const parsedCookies = await schema.parseAsync(req.cookies);
    req.cookies = parsedCookies;
    next();
  });
};

export default validateRequest;
