import { Schema, model, models } from "mongoose";
import { IUser } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        image: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: function () {
                return this.provider === "Email";
            },
        },
        provider: {
            type: String,
            enum: ["Google", "Github", "Email"],
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

userSchema.post("save", function (doc, next) {
    doc.password = "";
    next();
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password") && this.password) {
        this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds));
    }
    next();
});

export const userModel = model<IUser>("user", userSchema);
