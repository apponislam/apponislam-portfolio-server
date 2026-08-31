import { Document } from "mongoose";

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
