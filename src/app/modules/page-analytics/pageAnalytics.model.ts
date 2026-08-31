import mongoose, { Schema } from "mongoose";
import { IPageAnalytics } from "./pageAnalytics.interface";

const pageAnalyticsSchema = new Schema<IPageAnalytics>(
    {
        path: {
            type: String,
            required: true,
            default: "/",
            trim: true,
            index: true,
        },
        ipAddress: {
            type: String,
            required: true,
            trim: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        userAgent: {
            type: String,
            default: "",
        },
        date: {
            type: String,
            required: true,
            index: true,
        },
        count: {
            type: Number,
            default: 1,
        },
        lastVisitedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Compound unique index by Date + Path + IP to accurately track views per page per IP daily
pageAnalyticsSchema.index({ date: 1, path: 1, ipAddress: 1 }, { unique: true });

export const PageAnalyticsModel = mongoose.model<IPageAnalytics>("PageAnalytics", pageAnalyticsSchema);
