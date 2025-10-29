// user.model.ts
import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import { hashPassword } from "../../utils/bcryptHelper";
import { USER_ROLE, USER_STATUS } from "./user.constant";
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profilePhoto: String,
  phone: String,
  country: String,
  bio: String,
   role: {
      type: String,
      enum: Object.keys(USER_ROLE),
      required: true,
    },

    status: {
      type: String,
      enum: Object.keys(USER_STATUS),
      default: USER_STATUS.PENDING,
    },
  balance: { type: Number, default: 0 },
  totalEarnedWorker: { type: Number, default: 0 },
  totalSpentInfluencer: { type: Number, default: 0 },
  paymentMethod: String,
  socialLinks: {
    facebook: String,
    instagram: String,
    tiktok: String,
    youtube: String,
  },
  isVerified: { type: Boolean, default: false },
   refreshTokens: [{ type: String, select: false }]
}, { timestamps: true });

/* Hash password before saving */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


export const User = model<TUser>("User", userSchema);
