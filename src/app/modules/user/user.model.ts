// user.model.ts
import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";

const userSchema = new Schema<TUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profilePhoto: String,
  phone: String,
  country: String,
  bio: String,
  role: { type: String, required: true },
  status: { type: String, default: "ACTIVE" },
  balance: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  paymentMethod: String,
  socialLinks: {
    facebook: String,
    instagram: String,
    tiktok: String,
    youtube: String,
  },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

export const UserModel = model<TUser>("User", userSchema);
