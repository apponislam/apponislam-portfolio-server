import { z } from "zod";
import { UserRole } from "./auth.interface";

export const authValidationSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
        .optional(),
    image: z.string().url().optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
    provider: z.enum(["Google", "GitHub", "Email"]),
    role: z.nativeEnum(UserRole).optional(),
});
