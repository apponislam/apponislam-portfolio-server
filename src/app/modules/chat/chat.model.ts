import { Schema, model } from "mongoose";
import { IChatMessage, IChatSession } from "./chat.interface";

const chatSessionSchema = new Schema<IChatSession>(
    {
        sessionId: {
            type: String,
            required: [true, "Session ID is required"],
            unique: true,
            trim: true,
        },

        model: {
            type: String,
            required: [true, "Model name is required"],
            trim: true,
        },
        messageCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        lastActivityAt: {
            type: Date,
            default: Date.now,
        },
        expiresAt: {
            type: Date,
            required: [true, "Session expiration date is required"],
            index: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

// 1. Session lookup index: 'sessionId' already has a unique B-Tree index via unique: true
// 2. TTL index: Automatically remove expired sessions in the background
chatSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// 3. Sorting index for admin/activity queries
chatSessionSchema.index({ lastActivityAt: -1 });

const chatMessageSchema = new Schema<IChatMessage>(
    {
        session: {
            type: String,
            required: [true, "Session ID reference is required"],
            trim: true,
        },
        role: {
            type: String,
            enum: ["user", "assistant"],
            required: [true, "Role must be either user or assistant"],
        },
        content: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "completed",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

// 1. Optimal compound index for retrieving completed messages in chronological order (used for AI prompt history)
chatMessageSchema.index({ session: 1, status: 1, createdAt: 1 });

// 2. Optimal compound index for retrieving all session messages in order and cascading deleteMany({ session })
chatMessageSchema.index({ session: 1, createdAt: 1 });


export const ChatSession = model<IChatSession>("ChatSession", chatSessionSchema);
export const ChatMessage = model<IChatMessage>("ChatMessage", chatMessageSchema);
