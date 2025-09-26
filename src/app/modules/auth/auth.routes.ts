import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { authControllers } from "./auth.controllers";
import { handleFileOrJson } from "../../../utils/handleFileOrJson";
import { loginValidationSchema, registerValidationSchema } from "./auth.validation";

const router = Router();

// Register user
router.post("/register", handleFileOrJson({ fileField: "profile" }), validateRequest(registerValidationSchema), authControllers.register);

// Resend verification email
router.post("/resend-verify-email", authControllers.resendVerifyEmailController);

// Verify email
router.get("/verify-email", authControllers.verifyEmailController);

// Login
router.post("/login", validateRequest(loginValidationSchema), authControllers.login);

// Get logged-in user info
router.get("/me", auth, authControllers.getMeController);

// Refresh access token
router.post("/refresh-token", auth, authControllers.refreshAccessToken);

// Logout
router.post("/logout", authControllers.logout);

// Password reset OTP
router.post("/forgot-password", authControllers.requestPasswordResetOtpController);
router.post("/resend-reset-otp", authControllers.resendPasswordResetOtpController);
router.post("/reset-password", authControllers.resetPasswordWithOtpController);

// Change password
router.post("/change-password", auth, authControllers.changePasswordController);

export const authRoutes = router;
