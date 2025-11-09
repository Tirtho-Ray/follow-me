import { OrderModel } from "./order.model";
import { User } from "../user/user.model";
import { TOrder } from "./order.interface";
import { SocialPlatformModel } from "../socialPlatform/socialPlatform.mode";

const createOrderInDB = async (payload: TOrder) => {
  const platform = await SocialPlatformModel.findById(payload.platformId);
  if (!platform) throw new Error("Platform not found");

  const influencerExists = await User.findById(payload.influencerId);
  if (!influencerExists) throw new Error("Influencer not found");

  let totalAmount = 0;

  const actionsWithPrice = payload.actions.map((action) => {
    const platformAction = platform.actions.find((a) => a.type === action.type);
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
    status: "PENDING", // default
  });

  return order;
};

/* ---------- Helpers ---------- */
const calculateActionsCounts = (order: any) => {
  const relatedTasks = order.allTasks || [];
  return order.actions.map((action: any) => {
    const assigned = relatedTasks.filter((task: any) =>
      task.proofs?.some((p: any) => p.actionType === action.type)
    ).length;

    const completed = relatedTasks.reduce((count: any, task: any) => {
      const approvedProofs =
        task.proofs?.filter(
          (p: any) => p.actionType === action.type && p.status === "APPROVED"
        ) || [];
      return count + approvedProofs.length;
    }, 0);

    const pending = action.quantity - assigned;
    return {
      ...action.toObject(),
      assignedCount: assigned,
      completedCount: completed,
      pendingCount: pending > 0 ? pending : 0,
    };
  });
};

/* ---------- ADMIN ---------- */
const getAllOrdersFromDB = async () => {
  const orders = await OrderModel.find()
    .populate("influencerId")
    .populate("platformId")
    .populate("allTasks");

  return orders.map((order) => ({
    ...order.toObject(),
    actions: calculateActionsCounts(order),
  }));
};

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

/* ---------- INFLUENCER ---------- */
const getMyOrdersFromDB = async (influencerId: string) => {
  const orders = await OrderModel.find({ influencerId, isDeleted: false })
    .populate("platformId")
    .populate("allTasks");

  return orders.map((order) => ({
    ...order.toObject(),
    actions: calculateActionsCounts(order),
  }));
};

/* ---------- WORKER ---------- */
const getApprovedOrdersForViewer = async () => {
  const orders = await OrderModel.find({
    status: { $in: ["RUNNING", "COMPLETED"] },
    isDeleted: false,
  })
    .populate("platformId", "name")
    .populate("influencerId", "_id name");

  return orders.map((order) => ({
    ...order.toObject(),
    actions: calculateActionsCounts(order),
  }));
};

const getApprovedOrderByIdForViewer = async (id: string) => {
  const order = await OrderModel.findOne({
    _id: id,
    status: { $in: ["RUNNING", "COMPLETED"] },
    isDeleted: false,
  })
    .populate("platformId", "name")
    .populate("influencerId", "_id name");

  if (!order) throw new Error("Approved order not found");
  return {
    ...order.toObject(),
    actions: calculateActionsCounts(order),
  };
};

/* ---------- ADMIN STATUS UPDATE ---------- */
const updateOrderStatusInDB = async (
  id: string,
  status: "PENDING" | "RUNNING" | "COMPLETED" | "CANCELLED"
) => {
  const order = await OrderModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  )
    .populate("influencerId")
    .populate("platformId");

  if (!order) throw new Error("Order not found");
  return order;
};

/* ---------- DELETE ---------- */
const softDeleteOrderInDB = async (id: string) => {
  const order = await OrderModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!order) throw new Error("Order not found");
  return order;
};

const hardDeleteOrderInDB = async (id: string) => {
  const order = await OrderModel.findByIdAndDelete(id);
  if (!order) throw new Error("Order not found");
  return order;
};

export const OrderServices = {
  createOrderInDB,
  getAllOrdersFromDB,
  getOrderByIdFromDB,
  getMyOrdersFromDB,
  getApprovedOrdersForViewer,
  getApprovedOrderByIdForViewer,
  updateOrderStatusInDB,
  softDeleteOrderInDB,
  hardDeleteOrderInDB,
};
