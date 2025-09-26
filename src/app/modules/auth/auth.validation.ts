import { z } from "zod";
import { UserRole } from "./auth.interface";

export const registerValidationSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z
        .string()
        .nonempty("Email is required")
        .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
            message: "Invalid email address",
        }),
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
        .optional(),
    image: z.string().url().optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    provider: z.enum(["Google", "GitHub", "Email"]).default("Email"),
    role: z.nativeEnum(UserRole).optional().default(UserRole.USER),
});

// Login input
export const loginValidationSchema = z.object({
    email: z
        .string()
        .nonempty("Email is required")
        .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
            message: "Invalid email address",
        }),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

// Types
export type RegisterInput = z.infer<typeof registerValidationSchema>;
export type LoginInput = z.infer<typeof loginValidationSchema>;
