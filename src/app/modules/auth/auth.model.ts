import { model, Schema, Types } from "mongoose";
import { IAuth, UserRole } from "./auth.interface";

const AuthSchema = new Schema<IAuth>(
    {
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
        provider: {
            type: String,
            enum: ["Google", "GitHub", "Email"],
            required: [true, "Provider is required"],
            default: "Email",
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER,
            required: true,
        },
        isVerified: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        deletedAt: { type: Date },
        deletedBy: { type: Schema.Types.ObjectId, ref: "Auth" },
        deletedReason: { type: String },

        // Email verification fields
        verificationToken: { type: String },
        verificationTokenExpiry: { type: Date },

        // Password reset fields
        resetPasswordOtp: { type: String },
        resetPasswordOtpExpiry: { type: Date },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const AuthModel = model<IAuth>("Auth", AuthSchema);
