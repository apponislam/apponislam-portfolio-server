"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controllers_1 = require("./auth.controllers");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const authorized_1 = __importDefault(require("../../middlewares/authorized"));
const router = (0, express_1.Router)();
// Public routes
router.post("/register", auth_controllers_1.authControllers.register);
router.post("/login", auth_controllers_1.authControllers.login);
router.get("/verify-email", auth_controllers_1.authControllers.verifyEmail);
router.post("/resend-verification", auth_controllers_1.authControllers.resendVerificationEmail);
router.post("/refresh-token", auth_controllers_1.authControllers.refreshAccessToken);
router.post("/forgot-password", auth_controllers_1.authControllers.requestPasswordReset);
router.post("/verify-otp", auth_controllers_1.authControllers.verifyOtp);
router.post("/resend-otp", auth_controllers_1.authControllers.resendOtp);
router.post("/reset-password", auth_controllers_1.authControllers.resetPassword);
// Protected routes (require auth)
router.get("/me", auth_1.default, auth_controllers_1.authControllers.getMe);
router.post("/logout", auth_1.default, auth_controllers_1.authControllers.logout);
router.patch("/profile", auth_1.default, auth_controllers_1.authControllers.updateProfile);
router.post("/change-password", auth_1.default, auth_controllers_1.authControllers.changePassword);
router.post("/update-email", auth_1.default, auth_controllers_1.authControllers.updateEmail);
router.get("/verify-new-email", auth_controllers_1.authControllers.verifyNewEmail);
router.post("/resend-email-update", auth_1.default, auth_controllers_1.authControllers.resendEmailUpdate);
router.delete("/me", auth_1.default, auth_controllers_1.authControllers.deleteAccount);
// Admin only routes
router.post("/set-password/:userId", auth_1.default, (0, authorized_1.default)(["ADMIN"]), auth_controllers_1.authControllers.setUserPassword);
router.delete("/:userId", auth_1.default, (0, authorized_1.default)(["ADMIN"]), auth_controllers_1.authControllers.deleteUserByAdmin);
exports.authRoutes = router;
