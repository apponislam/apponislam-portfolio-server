"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidationSchema = void 0;
const zod_1 = require("zod");
const auth_interface_1 = require("./auth.interface");
exports.authValidationSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(1, "Full name is required"),
    email: zod_1.z.string().email("Invalid email address"),
    phone: zod_1.z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
        .optional(),
    image: zod_1.z.string().url().optional(),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters").optional(),
    provider: zod_1.z.enum(["Google", "GitHub", "Email"]),
    role: zod_1.z.nativeEnum(auth_interface_1.UserRole).optional(),
});
