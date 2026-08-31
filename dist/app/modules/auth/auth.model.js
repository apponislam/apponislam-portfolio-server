"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const userSchemaDefinition = {
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER",
        required: true,
    },
    phone: {
        type: String,
    },
    profileImage: {
        type: String,
    },
    language: {
        type: String,
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
    },
    aboutme: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    lastLogin: {
        type: Date,
    },
    resetPasswordOtp: String,
    resetPasswordOtpExpiry: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date,
    verificationToken: String,
    verificationCode: String,
    verificationExpiry: Date,
    pendingEmail: String,
    emailVerificationToken: String,
    emailVerificationExpiry: Date,
};
const UserSchema = new mongoose_1.Schema(userSchemaDefinition, {
    timestamps: true,
    versionKey: false,
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.resetPasswordOtp;
            delete ret.resetPasswordOtpExpiry;
            delete ret.resetPasswordToken;
            delete ret.resetPasswordTokenExpiry;
            delete ret.verificationToken;
            delete ret.verificationCode;
            delete ret.verificationExpiry;
            delete ret.emailVerificationToken;
            delete ret.emailVerificationExpiry;
            delete ret.pendingEmail;
            return ret;
        },
    },
});
// Authentication lookup (optimized for isDeleted filtering)
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ email: 1, isDeleted: 1 });
UserSchema.index({ name: 1, isDeleted: 1 });
UserSchema.index({ role: 1, isDeleted: 1 });
UserSchema.index({ isActive: 1, isDeleted: 1 });
UserSchema.index({ isEmailVerified: 1, isDeleted: 1 });
// Token & OTP lookup indexes (important for auth flows)
UserSchema.index({ resetPasswordToken: 1, isDeleted: 1 });
UserSchema.index({ resetPasswordOtp: 1, isDeleted: 1 });
UserSchema.index({ verificationToken: 1, isDeleted: 1 });
UserSchema.index({ verificationCode: 1, isDeleted: 1 });
UserSchema.index({ emailVerificationToken: 1, isDeleted: 1 });
// Activity tracking optimization
UserSchema.index({ lastLogin: -1 });
exports.UserModel = mongoose_1.default.model("User", UserSchema);
