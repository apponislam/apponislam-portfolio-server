"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidationSchema = exports.registerValidationSchema = void 0;
const zod_1 = require("zod");
const auth_interface_1 = require("./auth.interface");
exports.registerValidationSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1, "Full name is required"),
    email: zod_1.z
        .string()
        .nonempty("Email is required")
        .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: "Invalid email address",
    }),
    phone: zod_1.z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
        .optional(),
    image: zod_1.z.string().url().optional(),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters").optional(),
    provider: zod_1.z.enum(["Google", "GitHub", "Email"]).default("Email"),
    role: zod_1.z.nativeEnum(auth_interface_1.UserRole).optional().default(auth_interface_1.UserRole.USER),
});
// Login input
exports.loginValidationSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .nonempty("Email is required")
        .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: "Invalid email address",
    }),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
