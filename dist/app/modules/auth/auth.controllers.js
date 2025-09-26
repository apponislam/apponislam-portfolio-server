"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authControllers = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const auth_services_1 = require("./auth.services");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
// Register
const register = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const profileImg = req.file ? `/uploads/profile/${req.file.filename}` : undefined;
    const result = yield auth_services_1.authServices.registerUser(Object.assign(Object.assign({}, req.body), { image: profileImg }));
    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "User registered successfully",
        data: {
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        },
    });
}));
// Resend Verification Email
const resendVerifyEmailController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User ID is required");
    const result = yield auth_services_1.authServices.resendVerificationEmailService(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Verification email resent successfully",
        data: result,
    });
}));
// Verify Email
const verifyEmailController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, id } = req.query;
    if (!token || !id)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Token and user ID are required");
    const user = yield auth_services_1.authServices.verifyEmailService(id, token);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Email verified successfully",
        data: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            isVerified: user.isVerified,
        },
    });
}));
// Login
const login = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_services_1.authServices.loginUser(req.body);
    res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Login successful",
        data: {
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        },
    });
}));
// Get Me
const getMeController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id))
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized");
    const user = yield auth_services_1.authServices.getMeService(req.user._id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User info retrieved successfully",
        data: user,
    });
}));
// Refresh Access Token
const refreshAccessToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Refresh token is required");
    const result = yield auth_services_1.authServices.refreshTokenService(refreshToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Access token refreshed successfully",
        data: result,
    });
}));
// Logout
const logout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: config_1.default.node_env === "production",
        sameSite: "strict",
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User logged out successfully",
        data: null,
    });
}));
// Request Password Reset OTP
const requestPasswordResetOtpController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield auth_services_1.authServices.requestPasswordResetOtp(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null,
    });
}));
// Resend Password Reset OTP
const resendPasswordResetOtpController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield auth_services_1.authServices.resendPasswordResetOtp(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null,
    });
}));
// Reset Password With OTP
const resetPasswordWithOtpController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, newPassword } = req.body;
    const result = yield auth_services_1.authServices.resetPasswordWithOtp(email, otp, newPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null,
    });
}));
// Change Password
const changePasswordController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { currentPassword, newPassword } = req.body;
    if (!userId)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized");
    const result = yield auth_services_1.authServices.changePassword(userId, currentPassword, newPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null,
    });
}));
exports.authControllers = {
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
