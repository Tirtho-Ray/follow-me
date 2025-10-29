import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { TaskServices } from "./task.services";
import { Types } from "mongoose";
import AppError from "../../errors/appError";

// Create Task
const createTask = catchAsync(async (req, res) => {
  const workerId = req.user.id;
  console.log(workerId)
  // const {data} = req.body;

  const taskData ={
   ...req.body,
    workerId
  }
  const result = await TaskServices.createTaskInDB(taskData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Task created successfully",
    data: result,
  });
});

// Get all tasks
const getAllTasks = catchAsync(async (req, res) => {
  const result = await TaskServices.getAllTasksFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tasks fetched successfully",
    data: result,
  });
});

// Get single task
const getSingleTask = catchAsync(async (req, res) => {
  const { id } = req.params;
  if(!id) throw new AppError(httpStatus.NOT_FOUND,"id not found")
  const result = await TaskServices.getSingleTaskFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Task retrieved successfully",
    data: result,
  });
});


const updateProofStatus = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const { actionType, status } = req.body;
  const adminId = req.user?.id;
    if(!taskId) throw new AppError(httpStatus.NOT_FOUND,"id not found")

  const updatedTask = await TaskServices.updateProofStatusInDB(
    taskId,
    actionType,
    status,
    adminId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Proof '${actionType}' updated to ${status}`,
    data: updatedTask,
  });
});


const getMyTasks = catchAsync(async (req, res) => {
  const workerId = req.user?.id; 

  const tasks = await TaskServices.getWorkerTasksFromDB(workerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tasks fetched successfully",
    data: tasks,
  });
});


const deleteApprovedTasksController = catchAsync(async (req, res) => {
  const result = await TaskServices.deleteApprovedTasksService();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Approved proofs and tasks deleted successfully",
    data: result,
  });
});

export const TaskController = {
  createTask,
  getAllTasks,
  getSingleTask,
  updateProofStatus,
  getMyTasks,
  deleteApprovedTasksController, 
};
