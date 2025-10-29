
import { User } from "../modules/User/user.model";
import { EmailHelper } from "./emailSender";
import { generateOtp } from "./sendOTP";

export const generateAndSendOTP = async (userId: string|undefined) => {
  const { otp, otpExpiresAt } = generateOtp();

 
  await User.findByIdAndUpdate(userId, {
    otp,
    otpExpiresAt,
  });

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const emailHtml = await EmailHelper.createEmailContent(
    { name: user.name, otp },
    'otpEmail'
  );

  await EmailHelper.sendEmail(user.email, emailHtml, 'Your OTP Code');

  return otp;
};
