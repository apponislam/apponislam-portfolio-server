import { z } from "zod";

const createSessionSchema = z
    .object({
        model: z.string().trim().min(1, "Model name cannot be empty").optional(),
    })
    .optional()
    .default({});

const sendMessageSchema = z.object({
    sessionId: z
        .string({
            required_error: "sessionId is required",
            invalid_type_error: "sessionId must be a string",
        })
        .trim()
        .min(1, "sessionId cannot be empty"),
    message: z
        .string({
            required_error: "message is required",
            invalid_type_error: "message must be a string",
        })
        .trim()
        .min(1, "message cannot be empty"),
});

export const chatValidation = {
    createSessionSchema,
    sendMessageSchema,
};
