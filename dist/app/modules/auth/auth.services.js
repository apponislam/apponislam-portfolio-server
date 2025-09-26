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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const auth_model_1 = require("./auth.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
// import { sendVerificationEmail } from "../../../shared/emailVerifyMail";
// import { sendOtpEmail } from "../../../shared/sendOtpEmail";
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../../config"));
const jwtHelper_1 = require("../../../utils/jwtHelper");
const tokenGenerator_1 = require("../../../utils/tokenGenerator");
const mailer_1 = __importDefault(require("../../../utils/mailer"));
const verificationEmail_1 = require("../../../shared/templates/verificationEmail");
const otpEmail_1 = require("../../../shared/templates/otpEmail");
const usernameGenerator_1 = require("../../../utils/usernameGenerator");
const registerUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield auth_model_1.AuthModel.findOne({ email: data.email });
    if (existing)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Email already in use");
    const hashedPassword = data.password ? yield bcrypt_1.default.hash(data.password, Number(config_1.default.bcrypt_salt_rounds)) : undefined;
    const username = yield (0, usernameGenerator_1.generateUniqueUsername)(data.fullName);
    const { token, expiry } = (0, tokenGenerator_1.generateVerificationToken)(24);
    const user = yield auth_model_1.AuthModel.create(Object.assign(Object.assign({}, data), { username, password: hashedPassword, provider: "Email", isVerified: false, verificationToken: token, verificationTokenExpiry: expiry }));
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}&id=${user._id}`;
    yield (0, mailer_1.default)({
        to: user.email,
        subject: "Verify Your Email Address",
        html: (0, verificationEmail_1.generateVerificationEmailTemplate)(user.fullName, verificationUrl),
    });
    const _a = user.toObject(), { password: _ } = _a, userWithoutPassword = __rest(_a, ["password"]);
    const accessToken = jwtHelper_1.jwtHelper.generateToken(userWithoutPassword, config_1.default.jwt_access_secret, config_1.default.jwt_access_expire);
    const refreshToken = jwtHelper_1.jwtHelper.generateToken(userWithoutPassword, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expire);
    return { user: userWithoutPassword, accessToken, refreshToken };
});
const verifyEmailService = (userId, token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.AuthModel.findById(userId);
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    if (user.isVerified)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Email already verified");
    if (user.verificationToken !== token)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid token");
    if (!user.verificationTokenExpiry || user.verificationTokenExpiry < new Date())
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Token expired");
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    yield user.save();
    return user;
});
const resendVerificationEmailService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.AuthModel.findById(userId);
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    if (user.isVerified)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Email already verified");
    const { token, expiry } = (0, tokenGenerator_1.generateVerificationToken)();
    user.verificationToken = token;
    user.verificationTokenExpiry = expiry;
    yield user.save();
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}&id=${user._id}`;
    yield (0, mailer_1.default)({
        to: user.email,
        subject: "Verify Your Email Address",
        html: (0, verificationEmail_1.generateVerificationEmailTemplate)(user.fullName, verificationUrl),
    });
    return { email: user.email, sent: true };
});
const loginUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.AuthModel.findOne({ email: data.email }).select("+password");
    if (!user)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid credentials");
    const isMatch = yield bcrypt_1.default.compare(data.password, user.password);
    if (!isMatch)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid credentials");
    const _a = user.toObject(), { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
    const accessToken = jwtHelper_1.jwtHelper.generateToken(userWithoutPassword, config_1.default.jwt_access_secret, config_1.default.jwt_access_expire);
    const refreshToken = jwtHelper_1.jwtHelper.generateToken(userWithoutPassword, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expire);
    return { user: userWithoutPassword, accessToken, refreshToken };
});
const requestPasswordResetOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.AuthModel.findOne({ email });
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    const { otp, expiry } = (0, tokenGenerator_1.generateOtp)();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = expiry;
    yield user.save();
    yield (0, mailer_1.default)({
        to: user.email,
        subject: "Your OTP Code",
        html: (0, otpEmail_1.generateOtpEmailTemplate)(user.fullName, otp),
    });
    return { message: "OTP sent to email" };
});
const resendPasswordResetOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.AuthModel.findOne({ email });
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    const { otp, expiry } = (0, tokenGenerator_1.generateOtp)();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = expiry;
    yield user.save();
    yield (0, mailer_1.default)({
        to: user.email,
        subject: "Your OTP Code",
        html: (0, otpEmail_1.generateOtpEmailTemplate)(user.fullName, otp),
    });
    return { message: "OTP resent to email" };
});
const resetPasswordWithOtp = (email, otp, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.AuthModel.findOne({ email });
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid OTP");
    if (!user.resetPasswordOtpExpiry || user.resetPasswordOtpExpiry < new Date())
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "OTP expired");
    user.password = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpiry = undefined;
    yield user.save();
    return { message: "Password reset successful" };
});
const changePassword = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = typeof userId === "string" ? new mongoose_1.Types.ObjectId(userId) : userId;
    const user = yield auth_model_1.AuthModel.findById(_id).select("+password");
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    const isMatch = yield bcrypt_1.default.compare(currentPassword, user.password);
    if (!isMatch)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Current password is incorrect");
    user.password = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield user.save();
    return { message: "Password changed successfully" };
});
const getMeService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = typeof userId === "string" ? new mongoose_1.Types.ObjectId(userId) : userId;
    const user = yield auth_model_1.AuthModel.findById(_id).select("-password -resetPasswordOtp -resetPasswordOtpExpiry");
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    return user;
});
const refreshTokenService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Refresh token is required");
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_secret);
    const user = yield auth_model_1.AuthModel.findById(decoded._id);
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    const _a = user.toObject(), { password, verificationToken, verificationTokenExpiry } = _a, safeUser = __rest(_a, ["password", "verificationToken", "verificationTokenExpiry"]);
    const newAccessToken = jwtHelper_1.jwtHelper.generateToken(safeUser, config_1.default.jwt_access_secret, config_1.default.jwt_access_expire);
    return { accessToken: newAccessToken, user: safeUser };
});
exports.authServices = {
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
