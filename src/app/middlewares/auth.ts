// import { NextFunction, Request, Response } from 'express';
// import httpStatus from 'http-status';
// import { JwtPayload } from 'jsonwebtoken';
// import config from '../config';
// import AppError from '../errors/AppError';
// import { catchAsync } from '../utils/catchAsync';
// import { USER_ROLE } from '../modules/User/user.constant';
// import { verifyToken } from '../utils/verifyJWT';
// import { User } from '../modules/User/user.model';

// const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     let token = req.headers.authorization;

//     // check if token exists
//     if (!token) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
//     }

//     // Remove 'Bearer ' prefix if present
//     if (token.startsWith('Bearer ')) {
//       token = token.split(' ')[1];
//     } else {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'Token format is invalid!');
//     }

//     const decoded = verifyToken(token, config.jwt_access_secret as string) as JwtPayload & { _id: string, role: string, email: string };

//     const { role, email, iat, _id } = decoded;

//     // check if user exists
//     const user = await User.isUserExistsByEmail(email);

//     if (!user) {
//       throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
//     }

//     if (user.status === 'BLOCKED') {
//       throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!');
//     }

//     if (
//       user.passwordChangedAt &&
//       User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
//     ) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
//     }

//     // check roles
//     if (requiredRoles.length && !requiredRoles.includes(role as keyof typeof USER_ROLE)) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
//     }

//     // attach user to request
//     req.user = {
//       id: _id,
//       role,
//       email,
//     };

//     next();
//   });
// };


// export default auth;
