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
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelper_1 = require("../../../utils/jwtHelper");
const config_1 = __importDefault(require("../../config"));
const auth_model_1 = require("./auth.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const activity_services_1 = require("../activity/activity.services");
const activity_interface_1 = require("../activity/activity.interface");
const emailTemplates_1 = require("../../../utils/emailTemplates");
const registerUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Check existing user
    const existing = yield auth_model_1.UserModel.findOne({ email: data.email });
    if (existing)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Email already registered. Please sign in.");
    // Hash password
    const hashedPassword = yield bcrypt_1.default.hash(data.password, Number(config_1.default.bcrypt_salt_rounds));
    // Generate verification token
    const verificationToken = crypto_1.default.randomBytes(32).toString("hex");
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    // Create user
    const userData = Object.assign(Object.assign({}, data), { password: hashedPassword, isActive: true, isEmailVerified: false, verificationToken,
        verificationCode,
        verificationExpiry });
    const createdUser = yield auth_model_1.UserModel.create(userData);
    const verificationUrl = `${config_1.default.client_url}/verify-email?token=${verificationToken}&email=${createdUser.email}`;
    (0, emailTemplates_1.sendVerificationEmail)(createdUser.email, createdUser.name, verificationUrl, verificationCode);
    (0, emailTemplates_1.sendWelcomeEmail)(createdUser.email, createdUser.name);
    // Generate tokens
    const jwtPayload = {
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
    };
    const accessToken = jwtHelper_1.jwtHelper.generateToken(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expire);
    const refreshToken = jwtHelper_1.jwtHelper.generateToken(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expire);
    const userObject = createdUser.toObject();
    const { password: pwd, verificationToken: vToken, verificationExpiry: vExpiry, verificationCode: vCode } = userObject, userWithoutSensitive = __rest(userObject, ["password", "verificationToken", "verificationExpiry", "verificationCode"]);
    // Log activity in the background
    activity_services_1.activityServices.logActivity(createdUser._id.toString(), activity_interface_1.ActivityType.REGISTER, `Registered a new account with email ${createdUser.email}`, { userId: createdUser._id });
    return { user: userWithoutSensitive, accessToken, refreshToken };
});
const loginUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    // Find user
    const user = yield auth_model_1.UserModel.findOne({ email: data.email, isDeleted: false });
    if (!user)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Incorrect email or password");
    // Check password
    const isPasswordValid = yield bcrypt_1.default.compare(data.password, user.password);
    if (!isPasswordValid)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Incorrect email or password");
    // Check if active
    if (!user.isActive) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Your account has been deactivated. Please contact support for assistance.");
    }
    // Update last login
    yield auth_model_1.UserModel.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });
    // Generate tokens
    const jwtPayload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    const accessToken = jwtHelper_1.jwtHelper.generateToken(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expire);
    const refreshToken = jwtHelper_1.jwtHelper.generateToken(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expire);
    const _a = user.toObject(), { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
    // Log activity in the background
    activity_services_1.activityServices.logActivity(user._id.toString(), activity_interface_1.ActivityType.LOGIN, `Logged into the application`, { userId: user._id });
    return { user: userWithoutPassword, accessToken, refreshToken };
});
const verifyEmail = (email, token, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.UserModel.findOne({
        email,
        isDeleted: false,
        verificationExpiry: { $gt: new Date() },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not registered");
    }
    if (token) {
        if (user.verificationToken !== token) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Verification token is invalid or expired");
        }
    }
    else if (otp) {
        if (user.verificationCode !== otp) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Verification code (OTP) is invalid or expired");
        }
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Token or OTP is required");
    }
    // Mark email verified
    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationCode = undefined;
    user.verificationExpiry = undefined;
    yield user.save();
    // Log activity in the background
    activity_services_1.activityServices.logActivity(user._id.toString(), activity_interface_1.ActivityType.EMAIL_VERIFY, `Verified email address successfully`, { userId: user._id });
    return { message: "Email verified successfully" };
});
const resendVerificationEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.UserModel.findOne({ email, isDeleted: false });
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not registered");
    if (user.isEmailVerified) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Email already verified");
    }
    // Generate new verification token
    const verificationToken = crypto_1.default.randomBytes(32).toString("hex");
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    user.verificationToken = verificationToken;
    user.verificationCode = verificationCode;
    user.verificationExpiry = verificationExpiry;
    yield user.save();
    // Send verification email
    const verificationUrl = `${config_1.default.client_url}/verify-email?token=${verificationToken}&email=${user.email}`;
    (0, emailTemplates_1.sendVerificationEmail)(user.email, user.name, verificationUrl, verificationCode);
    return { message: "Verification email sent" };
});
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.UserModel.findOne({ _id: userId, isDeleted: false }).select("-password");
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not registered");
    return user;
});
const refreshAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!refreshToken)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Refresh token required");
    try {
        const decoded = jwtHelper_1.jwtHelper.verifyToken(refreshToken, config_1.default.jwt_refresh_secret);
        const user = yield auth_model_1.UserModel.findOne({ _id: decoded._id, isDeleted: false }).select("-password");
        if (!user)
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "User not registered");
        if (!user.isActive) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Your account has been deactivated. Please contact support.");
        }
        const jwtPayload = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        const accessToken = jwtHelper_1.jwtHelper.generateToken(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expire);
        return { user, accessToken };
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid refresh token");
    }
});
const requestPasswordReset = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.UserModel.findOne({ email, isDeleted: false });
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not registered");
    // Generate OTP
    const otp = crypto_1.default.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = otpExpiry;
    yield user.save();
    // Send OTP email
    (0, emailTemplates_1.sendOtpEmail)(email, otp, user.name);
    return { message: "OTP sent" };
});
const verifyOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.UserModel.findOne({ email, isDeleted: false });
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not registered");
    if (!user.resetPasswordOtp || !user.resetPasswordOtpExpiry) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "No OTP request found");
    }
    if (user.resetPasswordOtpExpiry < new Date()) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "OTP expired");
    }
    if (user.resetPasswordOtp !== otp) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid OTP");
    }
    // Generate reset token
    const resetToken = crypto_1.default.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
    // Clear OTP
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpiry = undefined;
    yield user.save();
    return { token: resetToken };
});
const resendOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.UserModel.findOne({ email, isDeleted: false });
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not registered");
    // Generate new OTP
    const otp = crypto_1.default.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = otpExpiry;
    yield user.save();
    // Send email
    (0, emailTemplates_1.sendOtpEmail)(email, otp, user.name);
    return { message: "OTP resent" };
});
const resetPassword = (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.UserModel.findOne({
        resetPasswordToken: token,
        resetPasswordTokenExpiry: { $gt: new Date() },
        isDeleted: false,
    });
    if (!user)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "The password reset link is invalid or has expired. Please try again.");
    // Hash new password
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    yield user.save();
    // Log activity in the background
    activity_services_1.activityServices.logActivity(user._id.toString(), activity_interface_1.ActivityType.PASSWORD_RESET, `Reset password using password recovery link`, { userId: user._id });
});
const updateProfile = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.UserModel.findOneAndUpdate({ _id: userId, isDeleted: false }, { $set: data }, { returnDocument: "after", runValidators: true }).select("-password");
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not registered");
    // Log activity in the background
    activity_services_1.activityServices.logActivity(userId, activity_interface_1.ActivityType.PROFILE_UPDATE, `Updated profile information`, { userId: user._id });
    return user;
});
const changePassword = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.UserModel.findOne({ _id: userId, isDeleted: false });
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not registered");
    const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, user.password);
    if (!isPasswordValid)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Incorrect current password");
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    user.password = hashedPassword;
    yield user.save();
    // Log activity in the background
    activity_services_1.activityServices.logActivity(userId, activity_interface_1.ActivityType.PASSWORD_CHANGE, `Changed profile password`, { userId: user._id });
});
const updateEmail = (userId, newEmail, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.UserModel.findOne({ _id: userId, isDeleted: false });
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not registered");
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Incorrect password");
    const existingUser = yield auth_model_1.UserModel.findOne({ email: newEmail, isDeleted: false });
    if (existingUser)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Email is already registered");
    // Generate verification token for new email
    const verificationToken = crypto_1.default.randomBytes(32).toString("hex");
    user.pendingEmail = newEmail;
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    yield user.save();
    // Send verification email
    const verificationUrl = `${config_1.default.client_url}/verify-new-email?token=${verificationToken}&email=${newEmail}`;
    (0, emailTemplates_1.sendEmailUpdateVerification)(newEmail, user.name, verificationUrl);
});
const resendEmailUpdate = (userId, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.UserModel.findOne({ _id: userId, isDeleted: false });
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not registered");
    if (!user.pendingEmail) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "No pending email update");
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Password is incorrect");
    // Generate new verification token
    const verificationToken = crypto_1.default.randomBytes(32).toString("hex");
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpiry = verificationExpiry;
    yield user.save();
    // Send verification email
    const verificationUrl = `${config_1.default.client_url}/verify-new-email?token=${verificationToken}&email=${user.pendingEmail}`;
    (0, emailTemplates_1.sendEmailUpdateVerification)(user.pendingEmail, user.name, verificationUrl);
    return { message: "Verification email resent" };
});
const verifyNewEmail = (token, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.UserModel.findOne({
        pendingEmail: email,
        emailVerificationToken: token,
        emailVerificationExpiry: { $gt: new Date() },
        isDeleted: false,
    });
    if (!user)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "The email verification link is invalid or has expired. Please try again.");
    // Update email
    user.email = email;
    user.pendingEmail = undefined;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    yield user.save();
    // Log activity in the background
    activity_services_1.activityServices.logActivity(user._id.toString(), activity_interface_1.ActivityType.EMAIL_UPDATE, `Updated account email to ${email}`, { userId: user._id });
    return { message: "New email verified successfully" };
});
const setUserPassword = (userId, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.UserModel.findOne({ _id: userId, isDeleted: false });
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not registered");
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    user.password = hashedPassword;
    yield user.save();
    // Send email with updated credentials to user
    (0, emailTemplates_1.sendAdminPasswordResetEmail)(user.email, user.name, newPassword);
});
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.UserModel.findByIdAndUpdate(userId, { $set: { isDeleted: true } }, { returnDocument: "after" });
    if (!user)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    // Log activity in the background
    activity_services_1.activityServices.logActivity(userId, activity_interface_1.ActivityType.USER_DELETE, `Deleted user account (soft delete)`, { userId: user._id });
    return user;
});
exports.authServices = {
    registerUser,
    loginUser,
    verifyEmail,
    resendVerificationEmail,
    getUserById,
    refreshAccessToken,
    requestPasswordReset,
    verifyOtp,
    resendOtp,
    resetPassword,
    updateProfile,
    changePassword,
    updateEmail,
    resendEmailUpdate,
    verifyNewEmail,
    setUserPassword,
    deleteUser,
};
