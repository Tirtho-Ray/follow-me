import { Model } from "mongoose";
import { USER_ROLE, USER_STATUS } from "./user.constant";


export interface TUser {
  _id:string;
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
  phone?: string;
  country?: string;
  bio?: string;

  role: keyof typeof USER_ROLE;
  status: keyof typeof USER_STATUS;

  balance?: number;      
  totalEarnedWorker?: number;   
  totalSpentInfluencer?: number;   
  paymentMethod?: "bKash" | "Nagad" | "Rocket" | "Bank" | "PayPal";

  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    linkedin?:string
  };


  passwordChangedAt?: Date;
  
   // OTP / Reset Flow
  otp?: string |null;
  otpExpiresAt?: Date | null;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;


  isVerified?: boolean;
  refreshTokens?: string[];
};

