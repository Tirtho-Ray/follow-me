import { Schema, model } from "mongoose";
import { ISocialPlatform } from "./socialPlatform.interface";

const socialPlatformSchema = new Schema<ISocialPlatform>({
  name: {
    type: String,
    enum: ["Facebook", "Instagram", "TikTok", "YouTube"],
    required: true,
    unique: true,
  },
  actions: [
    {
      type: {
        type: String,
        enum: ["FOLLOW", "LIKE", "COMMENT"],
        required: true,
      },
      defaultPrice: { type: Number, required: true },
    },
  ],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const SocialPlatformModel = model<ISocialPlatform>("SocialPlatform", socialPlatformSchema);
