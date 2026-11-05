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
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

// -----------------------------------------------------------------------------
// COMPREHENSIVE INDEXES FOR ULTRA-FAST SESSION QUERIES (SOFT-DELETE READY)
// -----------------------------------------------------------------------------

// 1. Session & Active Compound Indexes (Instant active session validation)
chatSessionSchema.index({ sessionId: 1, isDeleted: 1 });
chatSessionSchema.index({ sessionId: 1, expiresAt: 1, isDeleted: 1 });

// 2. Expiration & Active Indexes (Fast active session expiration checks)
chatSessionSchema.index({ expiresAt: 1, isDeleted: 1 });

// 3. Activity & Time Indexes (Fastest ordering for active sessions & admin monitoring)
chatSessionSchema.index({ isDeleted: 1, lastActivityAt: -1 });
chatSessionSchema.index({ isDeleted: 1, createdAt: -1 });
chatSessionSchema.index({ isDeleted: 1, messageCount: -1 });

// 4. Active Sessions Compound Index
chatSessionSchema.index({ expiresAt: 1, lastActivityAt: -1, isDeleted: 1 });

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
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

// -----------------------------------------------------------------------------
// COMPREHENSIVE INDEXES FOR CHAT STREAMING, THREADS & SOFT DELETION
// -----------------------------------------------------------------------------

// 1. Prompt History Retrieval Compound Index (Used on every message stream)
chatMessageSchema.index({ session: 1, isDeleted: 1, status: 1, createdAt: 1 });

// 2. Chronological Thread Index (Instant history loading for frontend)
chatMessageSchema.index({ session: 1, isDeleted: 1, createdAt: 1 });

// 3. Role-Based Lookups (Fast filtering by user or assistant)
chatMessageSchema.index({ session: 1, isDeleted: 1, role: 1, createdAt: 1 });

// 4. Session Lookup Index (Fast soft delete updates and counting)
chatMessageSchema.index({ session: 1, isDeleted: 1 });

// 5. Status & Failure Monitoring Indexes
chatMessageSchema.index({ isDeleted: 1, status: 1, createdAt: -1 });
chatMessageSchema.index({ isDeleted: 1, createdAt: -1 });

// 6. Full-Text Search Index for searching conversation text
chatMessageSchema.index({ content: "text" });

export const ChatSession = model<IChatSession>("ChatSession", chatSessionSchema);
export const ChatMessage = model<IChatMessage>("ChatMessage", chatMessageSchema);
