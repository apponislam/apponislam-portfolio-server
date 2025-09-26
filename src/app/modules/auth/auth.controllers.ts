// auth.controller.ts
import { Request, Response } from "express";
import catchAsync from "../../../utils/catchAsync";
import { authServices } from "./auth.services";
import httpStatus from "http-status";
import config from "../../../config";
import sendResponse from "../../../utils/sendResponse";
import ApiError from "../../../errors/ApiError";

// Register
const register = catchAsync(async (req: Request, res: Response) => {
    const profileImg = req.file ? `/uploads/profile/${req.file.filename}` : undefined;

    const result = await authServices.registerUser({
        ...req.body,
        image: profileImg,
    });

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User registered successfully",
        data: {
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        },
    });
});

// Resend Verification Email
const resendVerifyEmailController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.body;
    if (!id) throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required");

    const result = await authServices.resendVerificationEmailService(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Verification email resent successfully",
        data: result,
    });
});

// Verify Email
const verifyEmailController = catchAsync(async (req: Request, res: Response) => {
    const { token, id } = req.query;
    if (!token || !id) throw new ApiError(httpStatus.BAD_REQUEST, "Token and user ID are required");

    const user = await authServices.verifyEmailService(id as string, token as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Email verified successfully",
        data: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            isVerified: user.isVerified,
        },
    });
});

// Login
const login = catchAsync(async (req: Request, res: Response) => {
    const result = await authServices.loginUser(req.body);

    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Login successful",
        data: {
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        },
    });
});

// Get Me
const getMeController = catchAsync(async (req: Request, res: Response) => {
    if (!req.user?._id) throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");

    const user = await authServices.getMeService(req.user._id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User info retrieved successfully",
        data: user,
    });
});

// Refresh Access Token
const refreshAccessToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new ApiError(httpStatus.UNAUTHORIZED, "Refresh token is required");

    const result = await authServices.refreshTokenService(refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Access token refreshed successfully",
        data: result,
    });
});

// Logout
const logout = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: config.node_env === "production",
        sameSite: "strict",
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged out successfully",
        data: null,
    });
});

// Request Password Reset OTP
const requestPasswordResetOtpController = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await authServices.requestPasswordResetOtp(email);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: result.message,
        data: null,
    });
});

// Resend Password Reset OTP
const resendPasswordResetOtpController = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await authServices.resendPasswordResetOtp(email);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: result.message,
        data: null,
    });
});

// Reset Password With OTP
const resetPasswordWithOtpController = catchAsync(async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    const result = await authServices.resetPasswordWithOtp(email, otp, newPassword);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: result.message,
        data: null,
    });
});

// Change Password
const changePasswordController = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { currentPassword, newPassword } = req.body;
    if (!userId) throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");

    const result = await authServices.changePassword(userId, currentPassword, newPassword);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: result.message,
        data: null,
    });
});

export const authControllers = {
    register,
    resendVerifyEmailController,
    verifyEmailController,
    login,
    getMeController,
    refreshAccessToken,
    logout,
    requestPasswordResetOtpController,
    resendPasswordResetOtpController,
    resetPasswordWithOtpController,
    changePasswordController,
};
