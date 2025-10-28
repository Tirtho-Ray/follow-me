import { z } from "zod";

// Zod enums
const SocialActionEnum = z.enum(["FOLLOW", "LIKE", "COMMENT"]);
const MediaPlatformEnum = z.enum(["Facebook", "Instagram", "TikTok", "YouTube", "Linkedin", "X"]);

// Zod schemas
export const SocialActionSchema = z.object({
  type: SocialActionEnum,
  defaultPrice: z.number().min(0),
});

export const SocialPlatformSchema = z.object({
  name: MediaPlatformEnum,
  actions: z.array(SocialActionSchema).nonempty("At least one action required"),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const SocialValidation ={
SocialPlatformSchema
}