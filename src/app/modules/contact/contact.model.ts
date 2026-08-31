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

contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });

export const ContactModel = model<IContact>("Contact", contactSchema);
