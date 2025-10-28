export type SocialActionType = "FOLLOW" | "LIKE" | "COMMENT";

export interface ISocialAction {
  type: SocialActionType;
  defaultPrice: number; 
}

export interface ISocialPlatform {
  name: "Facebook" | "Instagram" | "TikTok" | "YouTube";
  actions: ISocialAction[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
