import { Types } from "mongoose";
import { TaskModel } from "./task.model";
import { TTask } from "./task.interface";
import AppError from "../../errors/appError";
import httpStatus from "http-status";
import { OrderModel } from "../order/order.model";

const createTaskInDB = async (payload: TTask) => {
  if (!payload.workerId) {
    throw new AppError(httpStatus.BAD_REQUEST, "workerId is required");
  }

  if (!payload.orderId) {
    throw new AppError(httpStatus.BAD_REQUEST, "orderId is required");
  }

  const order = await OrderModel.findById(payload.orderId);
  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  if (order.status !== "RUNNING") {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Tasks cannot be created for orders that are not RUNNING"
    );
  }

  //  Fetch all tasks by this worker for this order
  const existingTasks = await TaskModel.find({
    orderId: payload.orderId,
    workerId: payload.workerId,
  });

  // Collect all actionTypes that are still PENDING in previous tasks
  const pendingActions = existingTasks.flatMap(task =>
    task.proofs
      .filter(p => p.status === "PENDING")
      .map(p => p.actionType)
  );

  // Check if the new task has any actionType that is already pending
  const duplicateActions = payload.proofs
    .map(p => p.actionType)
    .filter(type => pendingActions.includes(type));

  if (duplicateActions.length > 0) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `You already have pending task(s) for action type(s): ${duplicateActions.join(", ")} in this order`
    );
  }

  const allowedActions = order.actions.map(a => a.type);
  const taskActionTypes = payload.proofs.map(p => p.actionType);

  const invalidActions = taskActionTypes.filter(type => !allowedActions.includes(type));

  if (invalidActions.length > 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid action type(s): ${invalidActions.join(", ")}. This order supports only: ${allowedActions.join(", ")}`
    );
  }

  const task = await TaskModel.create(payload);
  await OrderModel.findByIdAndUpdate(payload.orderId, {
    $push: { allTasks: task._id },
  });

  return task;
};


const getAllTasksFromDB = async (filter = {}) => {
  const tasks = await TaskModel.find(filter)
    .populate("workerId", "name email")
    .populate("orderId", "targetUrl status totalAmount");
  return tasks;
};

const getSingleTaskFromDB = async (id: string) => {
  const task = await TaskModel.findById(id)
    .populate("workerId", "name email")
    .populate("orderId", "targetUrl status totalAmount");
  return task;
};


const updateProofStatusInDB = async (
  taskId: string,
  actionType: string,
  status: "APPROVED" | "REJECTED",
  adminId: string
) => {
  const task = await TaskModel.findById(taskId)
    .populate('orderId')
    .populate('workerId');

  if (!task) throw new AppError(404, "Task not found");

  const proofs = task.proofs || [];
  const proof = proofs.find(p => p.actionType === actionType);

  if (!proof) throw new AppError(400, `Action type '${actionType}' not found in this task`);

  //  Prevent duplicate approval
  if (proof.status === status) {
    throw new AppError(400, `Action type '${actionType}' is already '${status}'`);
  }

  //  Update proof
  proof.status = status;
  proof.verifiedBy = new Types.ObjectId(adminId);
  proof.verifiedAt = new Date();

  //  Recalculate overallStatus
  const statuses = proofs.map(p => p.status);
  if (statuses.every(s => s === "APPROVED")) task.overallStatus = "APPROVED";
  else if (statuses.every(s => s === "REJECTED")) task.overallStatus = "REJECTED";
  else if (statuses.includes("APPROVED") && statuses.includes("REJECTED")) task.overallStatus = "PARTIAL_APPROVED";
  else task.overallStatus = "PENDING";

  await task.save();

  //  Handle payment only if it's newly approved
  if (status === "APPROVED") {
    const order: any = task.orderId;
    const worker: any = task.workerId;

    if (order && order.actions && worker) {
      const action = order.actions.find((a: any) => a.type === actionType);
      if (action) {
        const totalMoney = (proof.quantity || 1) * (action.unitPrice || 0);
        worker.balance = (worker.balance || 0) + totalMoney;
        worker.totalEarnedWorker = (worker.totalEarnedWorker || 0) + totalMoney;
        await worker.save();
      }
    }

    console.log(`Reposting action '${actionType}' for task ${taskId}...`);
  }

  return task;
};

const getWorkerTasksFromDB = async (workerId: string) => {
  const tasks = await TaskModel.find({ workerId })
    .populate("orderId", "targetUrl totalAmount status actions")
    .lean(); // lean() to return plain JSON

  if (!tasks || tasks.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No tasks found for this worker");
  }

  return tasks.map(task => {
    const order: any = task.orderId;

    // Map proofs with calculated money
    const proofsWithMoney = (task.proofs || []).map(p => {
      const action = order?.actions?.find((a: any) => a.type === p.actionType);
      const moneyEarned = (p.status === "APPROVED" ? (p.quantity || 1) * (action?.unitPrice || 0) : 0);

      return {
        actionType: p.actionType,
        quantity: p.quantity,
        screenshotUrls: p.screenshotUrls,
        status: p.status,
        verifiedBy: p.verifiedBy,
        verifiedAt: p.verifiedAt,
        moneyEarned, //  added money
      };
    });

    // Total money earned for this task
    const totalMoneyEarned = proofsWithMoney.reduce((sum, p) => sum + p.moneyEarned, 0);

    return {
      _id: task._id,
      orderId: order,
      proofs: proofsWithMoney,
      totalMoneyEarned, //  total for the task
      overallStatus: task.overallStatus,
      // createdAt: task.createdAt,
    };
  });
};


const deleteApprovedTasksService = async () => {
  // 1️⃣ Remove all approved proofs from tasks
  const removeProofsResult = await TaskModel.updateMany(
    {},
    { $pull: { proofs: { status: "APPROVED" } } } as any
  );

  // 2️⃣ Delete tasks that now have no proofs left
  const tasksToDelete = await TaskModel.find({ proofs: { $size: 0 } });
  const deletedTasksResult = await TaskModel.deleteMany({
    _id: { $in: tasksToDelete.map(t => t._id) },
  });

  return {
    approvedProofsRemoved: removeProofsResult.modifiedCount,
    tasksDeleted: deletedTasksResult.deletedCount,
  };
};

const getRecentApprovedEarningsService = async (limit = 20) => {
  const tasks = await TaskModel.find({ "proofs.status": "APPROVED" })
    .populate("workerId", "name")
    .populate("orderId", "targetUrl")
    .sort({ "proofs.verifiedAt": -1 })
    .limit(limit);


  const earningsFeed:any = [];

  for (const task of tasks) {
    const workerName = (task.workerId as any)?.name || "Unknown Worker";
    const orderUrl = (task.orderId as any)?.targetUrl || "N/A";

    task.proofs.forEach((p: any) => {
      if (p.status === "APPROVED") {
        earningsFeed.push({
          worker: workerName,
          orderUrl,
          actionType: p.actionType,
          earnedAmount: `${(p.quantity * 0.1).toFixed(2)}$`, // ধরো প্রতি অ্যাকশনে 0.1$
          verifiedAt: p.verifiedAt,
        });
      }
    });
  }

  earningsFeed.sort((a:any, b:any):any => b.verifiedAt - a.verifiedAt);

  return earningsFeed.slice(0, limit);
};


export const TaskServices = {
  createTaskInDB,
  getAllTasksFromDB,
  getSingleTaskFromDB,
  updateProofStatusInDB,
  getWorkerTasksFromDB,
  deleteApprovedTasksService, 
  getRecentApprovedEarningsService
};
