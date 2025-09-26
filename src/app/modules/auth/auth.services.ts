import { AuthModel } from "./auth.model";
import { LoginInput, RegisterInput } from "./auth.validation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
// import { sendVerificationEmail } from "../../../shared/emailVerifyMail";
// import { sendOtpEmail } from "../../../shared/sendOtpEmail";
import mongoose, { Types } from "mongoose";
import config from "../../../config";
import { jwtHelper } from "../../../utils/jwtHelper";
import { generateOtp, generateVerificationToken } from "../../../utils/tokenGenerator";
import sendMail from "../../../utils/mailer";
import { generateVerificationEmailTemplate } from "../../../shared/templates/verificationEmail";
import { generateOtpEmailTemplate } from "../../../shared/templates/otpEmail";
import { generateUniqueUsername } from "../../../utils/usernameGenerator";

const registerUser = async (data: RegisterInput) => {
    const existing = await AuthModel.findOne({ email: data.email });
    if (existing) throw new ApiError(httpStatus.BAD_REQUEST, "Email already in use");

    const hashedPassword = data.password ? await bcrypt.hash(data.password, Number(config.bcrypt_salt_rounds)) : undefined;

    const username = await generateUniqueUsername(data.fullName);

    const { token, expiry } = generateVerificationToken(24);

    const user = await AuthModel.create({
        ...data,
        username,
        password: hashedPassword,
        provider: "Email",
        isVerified: false,
        verificationToken: token,
        verificationTokenExpiry: expiry,
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}&id=${user._id}`;
    await sendMail({
        to: user.email,
        subject: "Verify Your Email Address",
        html: generateVerificationEmailTemplate(user.fullName, verificationUrl),
    });

    const { password: _, ...userWithoutPassword } = user.toObject();

    console.log(config.jwt_access_secret);
    console.log(config.jwt_access_expire);
    console.log(config.jwt_refresh_secret);
    console.log(config.jwt_refresh_expire);

    const accessToken = jwtHelper.generateToken(userWithoutPassword, config.jwt_access_secret as string, config.jwt_access_expire as string);
    const refreshToken = jwtHelper.generateToken(userWithoutPassword, config.jwt_refresh_secret as string, config.jwt_refresh_expire as string);

    return { user: userWithoutPassword, accessToken, refreshToken };
};

const verifyEmailService = async (userId: string, token: string) => {
    const user = await AuthModel.findById(userId);
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    if (user.isVerified) throw new ApiError(httpStatus.BAD_REQUEST, "Email already verified");
    if (user.verificationToken !== token) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid token");
    if (!user.verificationTokenExpiry || user.verificationTokenExpiry < new Date()) throw new ApiError(httpStatus.BAD_REQUEST, "Token expired");

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;

    await user.save();

    return user;
};

const resendVerificationEmailService = async (userId: string) => {
    const user = await AuthModel.findById(userId);
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    if (user.isVerified) throw new ApiError(httpStatus.BAD_REQUEST, "Email already verified");

    const { token, expiry } = generateVerificationToken();
    user.verificationToken = token;
    user.verificationTokenExpiry = expiry;
    await user.save();

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}&id=${user._id}`;
    await sendMail({
        to: user.email,
        subject: "Verify Your Email Address",
        html: generateVerificationEmailTemplate(user.fullName, verificationUrl),
    });

    return { email: user.email, sent: true };
};

const loginUser = async (data: LoginInput) => {
    const user = await AuthModel.findOne({ email: data.email }).select("+password");
    if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");

    const isMatch = await bcrypt.compare(data.password, user.password!);
    if (!isMatch) throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");

    const { password, ...userWithoutPassword } = user.toObject();

    const accessToken = jwtHelper.generateToken(userWithoutPassword, config.jwt_access_secret as string, config.jwt_access_expire as string);
    const refreshToken = jwtHelper.generateToken(userWithoutPassword, config.jwt_refresh_secret as string, config.jwt_refresh_expire as string);

    return { user: userWithoutPassword, accessToken, refreshToken };
};

const requestPasswordResetOtp = async (email: string) => {
    const user = await AuthModel.findOne({ email });
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

    const { otp, expiry } = generateOtp();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = expiry;
    await user.save();

    await sendMail({
        to: user.email,
        subject: "Your OTP Code",
        html: generateOtpEmailTemplate(user.fullName, otp),
    });

    return { message: "OTP sent to email" };
};

const resendPasswordResetOtp = async (email: string) => {
    const user = await AuthModel.findOne({ email });
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

    const { otp, expiry } = generateOtp();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = expiry;
    await user.save();

    await sendMail({
        to: user.email,
        subject: "Your OTP Code",
        html: generateOtpEmailTemplate(user.fullName, otp),
    });

    return { message: "OTP resent to email" };
};

const resetPasswordWithOtp = async (email: string, otp: string, newPassword: string) => {
    const user = await AuthModel.findOne({ email });
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

    if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
    if (!user.resetPasswordOtpExpiry || user.resetPasswordOtpExpiry < new Date()) throw new ApiError(httpStatus.BAD_REQUEST, "OTP expired");

    user.password = await bcrypt.hash(newPassword, Number(config.bcrypt_salt_rounds));
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpiry = undefined;
    await user.save();

    return { message: "Password reset successful" };
};

const changePassword = async (userId: string | Types.ObjectId, currentPassword: string, newPassword: string) => {
    const _id = typeof userId === "string" ? new Types.ObjectId(userId) : userId;
    const user = await AuthModel.findById(_id).select("+password");
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

    const isMatch = await bcrypt.compare(currentPassword, user.password!);
    if (!isMatch) throw new ApiError(httpStatus.BAD_REQUEST, "Current password is incorrect");

    user.password = await bcrypt.hash(newPassword, Number(config.bcrypt_salt_rounds));
    await user.save();

    return { message: "Password changed successfully" };
};

const getMeService = async (userId: string | Types.ObjectId) => {
    const _id = typeof userId === "string" ? new Types.ObjectId(userId) : userId;
    const user = await AuthModel.findById(_id).select("-password -resetPasswordOtp -resetPasswordOtpExpiry");
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    return user;
};

const refreshTokenService = async (token: string) => {
    if (!token) throw new ApiError(httpStatus.UNAUTHORIZED, "Refresh token is required");

    const decoded = jwt.verify(token, config.jwt_refresh_secret as string) as { _id: string; email: string };
    const user = await AuthModel.findById(decoded._id);
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

    const { password, ...userWithoutPassword } = user.toObject();
    const newAccessToken = jwtHelper.generateToken(userWithoutPassword, config.jwt_access_secret as string, config.jwt_access_expire as string);

    return { accessToken: newAccessToken, user: userWithoutPassword };
};

export const authServices = {
    registerUser,
    verifyEmailService,
    resendVerificationEmailService,
    loginUser,
    requestPasswordResetOtp,
    resendPasswordResetOtp,
    resetPasswordWithOtp,
    changePassword,
    getMeService,
    refreshTokenService,
};
