"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_controllers_1 = require("./auth.controllers");
const handleFileOrJson_1 = require("../../../utils/handleFileOrJson");
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
// Register user
router.post("/register", (0, handleFileOrJson_1.handleFileOrJson)({ fileField: "profile" }), (0, validateRequest_1.default)(auth_validation_1.registerValidationSchema), auth_controllers_1.authControllers.register);
// Resend verification email
router.post("/resend-verify-email", auth_controllers_1.authControllers.resendVerifyEmailController);
// Verify email
router.get("/verify-email", auth_controllers_1.authControllers.verifyEmailController);
// Login
router.post("/login", (0, validateRequest_1.default)(auth_validation_1.loginValidationSchema), auth_controllers_1.authControllers.login);
// Get logged-in user info
router.get("/me", auth_1.default, auth_controllers_1.authControllers.getMeController);
// Refresh access token
router.post("/refresh-token", auth_1.default, auth_controllers_1.authControllers.refreshAccessToken);
// Logout
router.post("/logout", auth_controllers_1.authControllers.logout);
// Password reset OTP
router.post("/forgot-password", auth_controllers_1.authControllers.requestPasswordResetOtpController);
router.post("/resend-reset-otp", auth_controllers_1.authControllers.resendPasswordResetOtpController);
router.post("/reset-password", auth_controllers_1.authControllers.resetPasswordWithOtpController);
// Change password
router.post("/change-password", auth_1.default, auth_controllers_1.authControllers.changePasswordController);
exports.authRoutes = router;
