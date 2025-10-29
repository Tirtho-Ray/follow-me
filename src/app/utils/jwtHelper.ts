/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { USER_ROLE, USER_STATUS } from "../modules/user/user.constant";
import AppError from "../errors/appError";

interface JwtUserPayload {
  _id?: string;
  name: string;
  email: string;
  role: keyof typeof USER_ROLE;
  status: keyof typeof USER_STATUS;
}

type ExpiresIn = number | `${number}${"s" | "m" | "h" | "d"}`;

export const createToken = (
  jwtPayload: JwtUserPayload,
  secret: Secret,
  expiresIn: ExpiresIn
): string => {
  const signOptions: SignOptions = { expiresIn };
  return jwt.sign(jwtPayload, secret, signOptions);
};

export const verifyToken = (token: string, secret: Secret): JwtPayload => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error: any) {
    throw new AppError(401, "You are not authorized!");
  }
};
