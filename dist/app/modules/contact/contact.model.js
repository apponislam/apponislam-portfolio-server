"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactModel = void 0;
const mongoose_1 = require("mongoose");
const replySchema = new mongoose_1.Schema({
    replyMessage: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
    resendId: { type: String },
}, { _id: false });
const contactSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
    versionKey: false,
});
// Comprehensive indexes for admin filtering, search queries, and analytics
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ name: "text", email: "text", message: "text" });
contactSchema.index({ ipAddress: 1 });
exports.ContactModel = (0, mongoose_1.model)("Contact", contactSchema);
