import { OrderModel } from "./order.model";
import { SocialPlatformModel } from "../socialPlatform/socialPlatform.mode";
import { User } from "../user/user.model";
import { TOrder } from "./order.interface";

const createOrderInDB = async (payload: TOrder) => {
  const platform = await SocialPlatformModel.findById(payload.platformId);
  if (!platform) throw new Error("Platform not found");

  const influencerExists = await User.findById(payload.influencerId);
  if (!influencerExists) throw new Error("Influencer not found");

  let totalAmount = 0;

  const actionsWithPrice = payload.actions.map(action => {
    const platformAction = platform.actions.find(a => a.type === action.type);
    if (!platformAction)
      throw new Error(`Action type ${action.type} not available on platform`);

    const unitPrice = platformAction.defaultPrice;
    const totalPrice = unitPrice * action.quantity;
    totalAmount += totalPrice;

    return { ...action, unitPrice, totalPrice };
  });

  const order = await OrderModel.create({
    ...payload,
    actions: actionsWithPrice,
    totalAmount,
  });

  return order;
};

const calculateActionsCounts = (order: any) => {
  const relatedTasks = order.allTasks || [];

  return order.actions.map((action: any) => {
    // Assigned: count of tasks which have this action type
    const assigned = relatedTasks.filter(
      (task: any) =>
        task.proofs?.some((p: any) => p.actionType === action.type)
    ).length;

    // Completed: count of proofs with status APPROVED for this action type
    const completed = relatedTasks.reduce((count:any, task: any) => {
      const approvedProofs = task.proofs?.filter(
        (p: any) => p.actionType === action.type && p.status === "APPROVED"
      ) || [];
      return count + approvedProofs.length;
    }, 0);

    // Pending = quantity - assigned
    const pending = action.quantity - assigned;

    return {
      ...action.toObject(),
      assignedCount: assigned,
      completedCount: completed,
      pendingCount: pending > 0 ? pending : 0,
    };
  });
};

//admin see
const getAllOrdersFromDB = async () => {
  const orders = await OrderModel.find()
    .populate("influencerId")
    .populate("platformId")
    .populate("allTasks");

  return orders.map(order => ({
    ...order.toObject(),
    actions: calculateActionsCounts(order),
  }));
};


//admin see
const getOrderByIdFromDB = async (id: string) => {
  const order = await OrderModel.findById(id)
    .populate("influencerId")
    .populate("platformId")
    .populate("allTasks");

  if (!order) throw new Error("Order not found");

  return {
    ...order.toObject(),
    actions: calculateActionsCounts(order),
  };
};



//worker see
const getAllOrdersForViewer = async () => {
  const orders = await OrderModel.find()
    .populate("platformId", "name")
    .populate("influencerId", "id");

  return orders.map(order => ({
    influencerId: order.influencerId._id,
    platformId: order.platformId._id,
    targetUrl: order.targetUrl,
      actions: calculateActionsCounts(order),
  }));
};
//worker see 
const getOrderByIdForViewer = async (id: string) => {
  const order = await OrderModel.findById(id)
    .populate("platformId", "name")
    .populate("influencerId", "id");

  if (!order) throw new Error("Order not found");

  return {
    influencerId: order.influencerId._id,
    platformId: order.platformId._id,
    targetUrl: order.targetUrl,
    actions: calculateActionsCounts(order),
  };
};

//update order like approve 
const updateOrderStatusInDB = async (id: string, status: "PENDING" | "RUNNING" | "COMPLETED" | "CANCELLED") => {
  const order = await OrderModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  )
    .populate("influencerId")
    .populate("platformId")
    .populate("allTasks");

  if (!order) throw new Error("Order not found");
  return order;
};

// ✅ Soft Delete Order (mark as deleted)
const softDeleteOrderInDB = async (id: string) => {
  const order = await OrderModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!order) throw new Error("Order not found");
  return order;
};

// ✅ Hard Delete Order (permanent removal)
const hardDeleteOrderInDB = async (id: string) => {
  const order = await OrderModel.findByIdAndDelete(id);
  if (!order) throw new Error("Order not found");
  return order;
};


export const OrderServices = {
  createOrderInDB,
  getAllOrdersFromDB,
  getOrderByIdFromDB,
  getAllOrdersForViewer,
  getOrderByIdForViewer,
  updateOrderStatusInDB,
  softDeleteOrderInDB,
  hardDeleteOrderInDB
};