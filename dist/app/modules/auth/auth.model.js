"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModel = void 0;
const mongoose_1 = require("mongoose");
const auth_interface_1 = require("./auth.interface");
const AuthSchema = new mongoose_1.Schema({
    username: { type: String, required: [true, "Username is required"], unique: true },
    fullName: { type: String, required: [true, "Full name is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true },
    phone: { type: String },
    image: { type: String },
    password: {
        type: String,
        required: function () {
            return this.provider === "Email";
        },
        default: null,
    },
    provider: { type: String, enum: ["Google", "GitHub", "Email"], required: [true, "Provider is required"] },
    role: {
        type: String,
        enum: Object.values(auth_interface_1.UserRole),
        default: auth_interface_1.UserRole.USER,
        required: true,
    },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    deletedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Auth" },
    deletedReason: { type: String },
}, { timestamps: true });
exports.AuthModel = (0, mongoose_1.model)("Auth", AuthSchema);
