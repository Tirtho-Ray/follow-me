import AppError from "../../errors/appError";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SocialServices } from "./socialPlatform.services";
import httpStatus from "http-status";

const createSocial = catchAsync(async (req, res) => {
  const { data } = req.body;
  const social = await SocialServices.createSocialInDB(data);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Social platform created successfully",
    data: social,
  });
});

const getAllSocials = catchAsync(async (req, res) => {
  const socials = await SocialServices.getAllSocialsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "All social platforms retrieved successfully",
    data: socials,
  });
});

const getSingleSocial = catchAsync(async (req, res) => {
  const { id } = req.params;
    if(!id) {
    throw new AppError(httpStatus.NOT_FOUND,"id not found")
  }
  const social = await SocialServices.getSingleSocialFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Social platform retrieved successfully",
    data: social,
  });
});

const updateSocial = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body.data;

  if(!id) {
    throw new AppError(httpStatus.NOT_FOUND,"id not found")
  }

  const social = await SocialServices.updateSocialInDB(id, updatedData);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Social platform updated successfully",
    data: social,
  });
});

const deleteSocial = catchAsync(async (req, res) => {
  const { id } = req.params;
    if(!id) {
    throw new AppError(httpStatus.NOT_FOUND,"id not found")
  }
  const result = await SocialServices.deleteSocialFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Social platform deleted successfully",
    data: result,
  });
});

export const SocialController = {
  createSocial,
  getAllSocials,
  getSingleSocial,
  updateSocial,
  deleteSocial,
};
