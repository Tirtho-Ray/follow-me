import { TSocialPlatform } from "./socialPlatform.interface";
import { SocialPlatformModel } from "./socialPlatform.mode";

const createSocialInDB = async (payload: TSocialPlatform) => {
  const social = await SocialPlatformModel.create(payload);
  return social;
};

const getAllSocialsFromDB = async () => {
  const socials = await SocialPlatformModel.find();
  return socials;
};

const getSingleSocialFromDB = async (id: string) => {
  const social = await SocialPlatformModel.findById(id);
  return social;
};

const updateSocialInDB = async (id: string, payload: Partial<TSocialPlatform>) => {
  const social = await SocialPlatformModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return social;
};

const deleteSocialFromDB = async (id: string) => {
  const social = await SocialPlatformModel.findByIdAndDelete(id);
  return social;
};

export const SocialServices = {
  createSocialInDB,
  getAllSocialsFromDB,
  getSingleSocialFromDB,
  updateSocialInDB,
  deleteSocialFromDB,
};
