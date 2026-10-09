import { Document, Schema, model } from "mongoose";

export interface IReply {
    replyMessage: string;
    sentAt: Date;
    resendId?: string;
}

export interface IContact extends Document {
    name: string;
    email: string;
    message: string;
    social?: string;
    ipAddress?: string;
    userAgent?: string;
    status: "unread" | "read" | "replied" | "archived";
    resendAdminId?: string;
    resendAutoReplyId?: string;
    adminNotes?: string;
    replies: IReply[];
    repliedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const replySchema = new Schema<IReply>(
    {
        replyMessage: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
        resendId: { type: String },
    },
    { _id: false }
);

const contactSchema = new Schema<IContact>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        message: { type: String, required: true },
        social: { type: String },
        ipAddress: { type: String },
        userAgent: { type: String },
        status: {
            type: String,
            enum: ["unread", "read", "replied", "archived"],
            default: "unread",
        },
        resendAdminId: { type: String },
        resendAutoReplyId: { type: String },
        adminNotes: { type: String },
        replies: [replySchema],
        repliedAt: { type: Date },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// -----------------------------------------------------------------------------
// COMPREHENSIVE INDEXES FOR SEARCH, FILTERING, SPAM CHECKING & ANALYTICS
// -----------------------------------------------------------------------------

// 1. Status & Time Compound Indexes (Admin filtering & pagination)
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ repliedAt: -1 });

// 2. User & Email Compound Indexes (Lookups & thread history)
contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ status: 1, email: 1, createdAt: -1 });

// 3. Security & Anti-Spam / Rate-limiting Indexes
contactSchema.index({ ipAddress: 1, createdAt: -1 });

// 4. Text Search Index for multi-field admin search
contactSchema.index(
    { name: "text", email: "text", message: "text" },
    { weights: { name: 3, email: 2, message: 1 }, name: "ContactTextIndex" }
);

export const ContactModel = model<IContact>("Contact", contactSchema);

