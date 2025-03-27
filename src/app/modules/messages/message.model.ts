import mongoose, { Schema, Document } from "mongoose";
import { IMessage } from "./message.interface";

const messageSchema: Schema = new Schema<IMessage>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        social: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const messageModel = mongoose.model<IMessage>("message", messageSchema);

export default messageModel;
