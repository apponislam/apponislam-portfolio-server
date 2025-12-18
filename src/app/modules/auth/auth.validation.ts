// import { z } from "zod";
// import { UserRole } from "./auth.interface";

// export const registerValidationSchema = z.object({
//     fullName: z.string().min(1, "Full name is required"),
//     email: z
//         .string()
//         .nonempty("Email is required")
//         .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
//             message: "Invalid email address",
//         }),
//     phone: z
//         .string()
//         .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
//         .optional(),
//     image: z.string().url().optional(),
//     password: z.string().min(6, "Password must be at least 6 characters").optional(),
//     provider: z.enum(["Google", "GitHub", "Email"]).default("Email"),
//     role: z.nativeEnum(UserRole).optional().default(UserRole.USER),
// });

// // Login input
// export const loginValidationSchema = z.object({
//     email: z
//         .string()
//         .nonempty("Email is required")
//         .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
//             message: "Invalid email address",
//         }),
//     password: z.string().min(6, "Password must be at least 6 characters"),
// });

// // Types
// export type RegisterInput = z.infer<typeof registerValidationSchema>;
// export type LoginInput = z.infer<typeof loginValidationSchema>;

import { z } from "zod";
import { UserRole } from "./auth.interface";

export const registerValidationSchema = z.object({
    fullName: z.string().min(1, "Full name is required").max(100, "Full name cannot exceed 100 characters").trim(),

    email: z.string().min(1, "Email is required").email("Invalid email address").max(100, "Email cannot exceed 100 characters").toLowerCase().trim(),

    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format. Use international format: +1234567890")
        .optional()
        .or(z.literal("")),

    image: z
        .string()
        .url("Invalid image URL")
        .optional()
        .or(z.literal(""))
        .refine((val) => !val || val.length <= 500, {
            message: "Image URL cannot exceed 500 characters",
        }),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password cannot exceed 50 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
        .optional(),

    provider: z.enum(["Google", "GitHub", "Email"]).default("Email"),
    role: z.nativeEnum(UserRole).optional().default(UserRole.USER),
});

// Login input
export const loginValidationSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address").max(100, "Email cannot exceed 100 characters").toLowerCase().trim(),

    password: z.string().min(1, "Password is required").max(50, "Password cannot exceed 50 characters"),
});

// Types
export type RegisterInput = z.infer<typeof registerValidationSchema>;
export type LoginInput = z.infer<typeof loginValidationSchema>;
