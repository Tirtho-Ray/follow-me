import { Types } from "mongoose";
import { SocialActionType } from "../socialPlatform/socialPlatform.interface";


export interface ITaskProof {
  actionType: SocialActionType;        
  // actionType: SocialActionType | "FOLLOW" | "LIKE" | "COMMENT";        
  quantity?: number;                    
  screenshotUrls: string[];            
  status: "PENDING" | "APPROVED" | "REJECTED"; 
  verifiedBy?: Types.ObjectId;         
  verifiedAt?: Date;                   
}

export interface TTask {
  workerId: Types.ObjectId;           
  orderId: Types.ObjectId;             
  proofs: ITaskProof[];                
  overallStatus: "PENDING" | "PARTIAL_APPROVED" | "APPROVED" | "REJECTED"; 
};
