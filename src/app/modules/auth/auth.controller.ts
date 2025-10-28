// controllers/auth.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { AuthServices } from './auth.services';
import sendResponse from '../../utils/sendResponse';
import { TLoginUser, TRegisterUser } from './auth.interface';
import { setTokensInCookies, clearTokensFromCookies } from '../../utils/cookieHelper';
import AppError from '../../errors/appError';

const register = catchAsync(async (req: Request, res: Response) => {
  const payload: TRegisterUser = req.body;
  const { accessToken, refreshToken, user } = await AuthServices.registerUser(payload);

  setTokensInCookies(res, accessToken, refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User registered successfully',
    data: { user },
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const payload: TLoginUser = req.body;
  const { accessToken, refreshToken, user } = await AuthServices.loginUser(payload);

  setTokensInCookies(res, accessToken, refreshToken);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Login successful',
    data: { user },
  });
});

const logout = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    throw new AppError(httpStatus.NOT_FOUND,"refresh token not found")
  }

  await AuthServices.logoutUser(refreshToken);
  clearTokensFromCookies(res);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Logged out successfully',
     data:null
  });
});

const refreshAccessToken = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return sendResponse(res, {
      success: false,
      statusCode: httpStatus.BAD_REQUEST,
      message: 'Refresh token is required',
      data:null
    });
  }

  const { accessToken } = await AuthServices.refreshAccessToken(refreshToken);
  setTokensInCookies(res, accessToken, refreshToken); // only update accessToken cookie

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Access token refreshed successfully',
     data:null
  });
});

export const AuthController = { register, login, logout, refreshAccessToken };
