import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../config';
import AppError from '../errors/appError';
import { verifyToken } from '../utils/jwtHelper';
import { User } from '../modules/user/user.model';
import { USER_ROLE } from '../modules/user/user.constant';

const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {

      const token = req.cookies?.accessToken;
      if (!token) throw new AppError(httpStatus.UNAUTHORIZED, 'Token missing!');


      let decoded: any;
      try {
        decoded = verifyToken(token, config.jwt_access_secret!);
      } catch (err: any) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token!');
      }

      const { _id, role, email } = decoded;


      const user = await User.findById(_id);
      if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
      if (user.status === 'BLOCKED') throw new AppError(httpStatus.FORBIDDEN, 'User is blocked!');

      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new AppError(httpStatus.FORBIDDEN, 'You do not have permission!');
      }

      (req as any).user = { id: _id, role, email };

      next();
    } catch (err: any) {
      next(err);
    }
  };
};

export default auth;
