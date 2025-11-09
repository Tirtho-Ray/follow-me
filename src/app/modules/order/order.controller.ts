import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderServices } from "./order.services";
import AppError from "../../errors/appError";

/* ---------- Influencer ---------- */
const createOrder = catchAsync(async (req: Request, res: Response) => {
  const influencerId = req.user.id;
  const orderData = { ...req.body, influencerId };
  const order = await OrderServices.createOrderInDB(orderData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Order created successfully",
    data: order,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const influencerId = req.user.id;
  const result = await OrderServices.getMyOrdersFromDB(influencerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Your orders fetched successfully",
    data: result,
  });
});

/* ---------- Admin ---------- */
const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getAllOrdersFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All orders fetched successfully",
    data: result,
  });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new AppError(httpStatus.BAD_REQUEST, "Order ID is required");

  const result = await OrderServices.getOrderByIdFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order fetched successfully",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
   if(!id){
    throw new AppError(httpStatus.NOT_FOUND,"id not found")
  }

  const allowedStatuses = ["RUNNING", "COMPLETED", "CANCELLED"];
  if (!allowedStatuses.includes(status))
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid status value");

  const order = await OrderServices.updateOrderStatusInDB(id, status);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Order status updated to ${status}`,
    data: order,
  });
});

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

/* ---------- Worker ---------- */
const getApprovedOrdersForViewer = catchAsync(async (req: Request, res: Response) => {
  const orders = await OrderServices.getApprovedOrdersForViewer();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Approved orders fetched successfully",
    data: orders,
  });
});

const getApprovedOrderByIdForViewer = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
   if(!id){
    throw new AppError(httpStatus.NOT_FOUND,"id not found")
  }
  const order = await OrderServices.getApprovedOrderByIdForViewer(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Approved order details fetched successfully",
    data: order,
  });
});

export const OrderController = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  softDeleteOrder,
  hardDeleteOrder,
  getApprovedOrdersForViewer,
  getApprovedOrderByIdForViewer,
};
