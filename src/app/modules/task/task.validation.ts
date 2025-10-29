import { z } from "zod";

// Validate each proof
const taskProofSchema = z.object({
  actionType: z.enum(["FOLLOW", "LIKE", "COMMENT"]),
  quantity: z.number().min(1).optional(),
  screenshotUrls: z.array(z.string().url()).nonempty("At least one screenshot URL is required"),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  verifiedBy: z.string().optional(), // MongoDB ObjectId as string
  verifiedAt: z.date().optional(),
});

// Validate entire task
export const CreateTaskSchema = z.object({
  workerId: z.string(), // MongoDB ObjectId as string
  orderId: z.string(), // MongoDB ObjectId as string
  proofs: z.array(taskProofSchema).nonempty("At least one proof is required"),
  overallStatus: z.enum(["PENDING", "PARTIAL_APPROVED", "APPROVED", "REJECTED"]).optional(),
});

// TypeScript type inferred from Zod
export const TaskValidation ={
CreateTaskSchema
}
