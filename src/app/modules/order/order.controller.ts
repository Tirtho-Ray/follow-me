import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderServices } from "./order.services";
import AppError from "../../errors/appError";

// ✅ Create Order
const createOrder = catchAsync(async (req: Request, res: Response) => {
  const influencerId = req.user.id; // assuming user is attached to req by auth middleware
  const data = req.body;

  console.log("Checking influencer:", influencerId);
  console.log("Order data:", data);

  const orderData = {
    ...data,
    influencerId,
  };

  const order = await OrderServices.createOrderInDB(orderData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Order created successfully",
    data: order,
  });
});

// ✅ Admin: Get All Orders
const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getAllOrdersFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders fetched successfully",
    data: result,
  });
});

// ✅ Admin: Get Order By ID
const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if(!id){
    throw new AppError(httpStatus.NOT_FOUND,"id not found")
  }
  const result = await OrderServices.getOrderByIdFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order fetched successfully",
    data: result,
  });
});

// ✅ Worker/Viewer: Get All Orders
const getAllOrdersForViewerController = catchAsync(async (req: Request, res: Response) => {
  const orders = await OrderServices.getAllOrdersForViewer();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Orders fetched successfully for viewer",
    data: orders,
  });
});

// ✅ Worker/Viewer: Get Single Order
const getOrderByIdForViewerController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if(!id){
    throw new AppError(httpStatus.NOT_FOUND,"id not found")
  }
  const order = await OrderServices.getOrderByIdForViewer(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order fetched successfully for viewer",
    data: order,
  });
});


// ✅ Update order status
const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
   if(!id){
    throw new AppError(httpStatus.NOT_FOUND,"id not found")
  }

  const allowedStatuses = ["PENDING", "RUNNING", "COMPLETED", "CANCELLED"];
  if (!allowedStatuses.includes(status))
    throw new Error(`Invalid status value. Allowed: ${allowedStatuses.join(", ")}`);

  const order = await OrderServices.updateOrderStatusInDB(id, status);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Order status updated to ${status}`,
    data: order,
  });
});

//  Soft delete (mark as deleted)
const softDeleteOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
   if(!id){
    throw new AppError(httpStatus.NOT_FOUND,"id not found")
  }
  const order = await OrderServices.softDeleteOrderInDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order soft deleted successfully",
    data: order,
  });
});

//  Hard delete (remove permanently)

const hardDeleteOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
   if(!id){
    throw new AppError(httpStatus.NOT_FOUND,"id not found")
  }
  const order = await OrderServices.hardDeleteOrderInDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order permanently deleted successfully",
    data: order,
  });
});


export const OrderController = {
  createOrder,
  getAllOrders,
  getOrderById,
  getAllOrdersForViewerController,
  getOrderByIdForViewerController,
  updateOrderStatus,
  softDeleteOrder,
  hardDeleteOrder
};
