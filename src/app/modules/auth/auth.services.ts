/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TLoginUser, TRegisterUser } from './auth.interface';
import config from '../../config';
import { USER_STATUS } from '../user/user.constant';
import AppError from '../../errors/appError';
import { comparePassword, hashPassword } from '../../utils/bcryptHelper';
import { createToken, verifyToken } from '../../utils/jwtHelper';

const registerUser = async (payload: TRegisterUser) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) throw new AppError(httpStatus.CONFLICT, 'User already exists!');

  // const hashedPassword = await hashPassword(payload.password);

  const newUser = await User.create({ 
    ...payload, 
    // password: hashedPassword,
    status: USER_STATUS.ACTIVE,
    refreshTokens: [] // Multi-device support
  });

  const jwtPayload = {
    _id: newUser._id.toString(),
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    status: newUser.status
  };

  const accessToken = createToken(jwtPayload, config.jwt_access_secret!, '15m');
  const refreshToken = createToken(jwtPayload, config.jwt_refresh_secret!, '7d');

  // Ensure refreshTokens is array
  newUser.refreshTokens = newUser.refreshTokens || [];
  newUser.refreshTokens.push(refreshToken);
  await newUser.save();

  return {
    accessToken,
    refreshToken,
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status
    }
  };
};

const loginUser = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email }).select('+password +refreshTokens');
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  if (user.status === USER_STATUS.BLOCKED) throw new AppError(httpStatus.FORBIDDEN, 'User is blocked!');

  const isMatch = await comparePassword(payload.password, user.password);
  console.log("Password match result:", isMatch);
  console.log(payload.password, user.password)
  if (!isMatch) throw new AppError(httpStatus.FORBIDDEN, 'Incorrect password!');

  const jwtPayload = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  };

  const accessToken = createToken(jwtPayload, config.jwt_access_secret!, '15m');
  const refreshToken = createToken(jwtPayload, config.jwt_refresh_secret!, '7d');

  // Ensure refreshTokens is array
  user.refreshTokens = user.refreshTokens || [];
  user.refreshTokens.push(refreshToken);
  await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  };
};

const logoutUser = async (refreshToken: string) => {
  const user = await User.findOne({ refreshTokens: refreshToken });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'Invalid refresh token!');

  // Ensure refreshTokens is array
  user.refreshTokens = user.refreshTokens || [];
  // Remove only the token that user logged out from
  user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
  await user.save();

  return { message: 'Logged out successfully' };
};

const refreshAccessToken = async (refreshToken: string) => {
  try {
    const payload: any = verifyToken(refreshToken, config.jwt_refresh_secret!);
    const user = await User.findOne({ _id: payload._id, refreshTokens: refreshToken });
    if (!user) throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid refresh token!');

    const jwtPayload = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    };

    const accessToken = createToken(jwtPayload, config.jwt_access_secret!, '15m');

    return { accessToken };
  } catch (err: any) {
    throw new AppError(httpStatus.UNAUTHORIZED, err.message || 'Could not refresh token!');
  }
};

export const AuthServices = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken
};
