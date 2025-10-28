import { Schema, model } from "mongoose";
import { TSocialPlatform } from "./socialPlatform.interface";


const socialPlatformSchema = new Schema<TSocialPlatform>(
  {
    name: {
      type: String,
      enum: ["Facebook", "Instagram", "TikTok", "YouTube", "Linkedin", "X"],
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
  },
  { timestamps: true }
);

export const SocialPlatformModel = model<TSocialPlatform>(
  "SocialPlatform",
  socialPlatformSchema
);
