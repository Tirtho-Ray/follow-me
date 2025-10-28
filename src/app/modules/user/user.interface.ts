import { USER_ROLE, USER_STATUS } from "./user.constant";


export interface TUser {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
  phone?: string;
  country?: string;
  bio?: string;

  role: keyof typeof USER_ROLE;
  status: keyof typeof USER_STATUS;

  balance?: number;       // wallet balance
  totalEarned?: number;   // worker earnings
  totalSpent?: number;    // influencer spending
  paymentMethod?: "bKash" | "Nagad" | "Rocket" | "Bank" | "PayPal";

  socialLinks?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    linkedin?:string
  };

  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
