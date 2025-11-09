import { Types } from "mongoose";

export interface TOrderAction {
  type: "FOLLOW" | "LIKE" | "COMMENT";
  quantity: number;              
  assignedCount?: number;       
  pendingCount?: number;        
  completedCount?: number;      
  unitPrice?: number;           
  totalPrice?: number; 
           
}

export interface TOrder {
  influencerId: Types.ObjectId; 
  platformId: Types.ObjectId;  
  targetUrl: string;    
  actions: TOrderAction[]; 
  transaction:string;
  totalAmount?: number;    
  status: "PENDING" | "RUNNING" | "COMPLETED" | "CANCELLED";
  allTasks?: Types.ObjectId[];
  isDeleted:boolean;

}
