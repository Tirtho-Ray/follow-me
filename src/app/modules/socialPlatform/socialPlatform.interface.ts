// Types
export type SocialActionType = "FOLLOW" | "LIKE" | "COMMENT";
export type MediaPlatform = "Facebook" | "Instagram" | "TikTok" | "YouTube" | "Linkedin" | "X";

export interface TSocialAction {
  type: SocialActionType;
  defaultPrice: number;
}

export interface TSocialPlatform {
  name: MediaPlatform;
  actions: TSocialAction[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
