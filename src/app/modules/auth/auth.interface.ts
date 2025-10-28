import { USER_ROLE, USER_STATUS } from "../user/user.constant";

export type TLoginUser = {
  email: string;
  password: string;
};

export type TRegisterUser = {
  name: string;
  email: string;
  mobileNumber: string;
  password: string;
  role: keyof typeof USER_ROLE;
  status?: keyof typeof USER_STATUS; 
};
