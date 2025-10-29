import { Types } from "mongoose";

export interface TOrderAction {
  type: "FOLLOW" | "LIKE" | "COMMENT";
  quantity: number;              // total required quantity
  assignedCount?: number;        // কতগুলো worker এর কাছে assign হয়েছে
  pendingCount?: number;         // কতগুলো কাজ pending
  completedCount?: number;       // কতগুলো কাজ সম্পন্ন
  unitPrice?: number;            // একক কাজের দাম
  totalPrice?: number;           // মোট দাম (quantity * unitPrice)
}

export interface TOrder {
  influencerId: Types.ObjectId; 
  platformId: Types.ObjectId;  
  targetUrl: string;    
  actions: TOrderAction[]; 
  totalAmount?: number;    
  status: "PENDING" | "RUNNING" | "COMPLETED" | "CANCELLED";
  allTasks?: Types.ObjectId[];
  isDeleted:boolean;
}
