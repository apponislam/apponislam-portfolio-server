import mongoose, { Schema } from "mongoose";
import { IPageAnalytics } from "./pageAnalytics.interface";

const pageAnalyticsSchema = new Schema<IPageAnalytics>(
    {
        path: {
            type: String,
            required: true,
            default: "/",
            trim: true,
        },
        ipAddress: {
            type: String,
            required: true,
            trim: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },
        userAgent: {
            type: String,
            default: "",
        },
        date: {
            type: String,
            required: true,
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

// -----------------------------------------------------------------------------
// COMPOUND INDEXES FOR MAXIMUM QUERY & AGGREGATION PERFORMANCE
// -----------------------------------------------------------------------------

// 1. Compound Unique Index: Daily page view upsert tracking per IP
pageAnalyticsSchema.index({ date: 1, path: 1, ipAddress: 1 }, { unique: true });

// 2. Query & Sorting Indexes: Log filtering by path, date, IP, user with lastVisitedAt sort
pageAnalyticsSchema.index({ lastVisitedAt: -1 });
pageAnalyticsSchema.index({ date: -1, lastVisitedAt: -1 });
pageAnalyticsSchema.index({ path: 1, lastVisitedAt: -1 });
pageAnalyticsSchema.index({ date: -1, path: 1, lastVisitedAt: -1 });
pageAnalyticsSchema.index({ ipAddress: 1, lastVisitedAt: -1 });
pageAnalyticsSchema.index({ userId: 1, lastVisitedAt: -1 });

// 3. Aggregation Indexes: Top pages, daily view count totals & analytics trends
pageAnalyticsSchema.index({ path: 1, count: -1 });
pageAnalyticsSchema.index({ date: 1, count: -1 });

export const PageAnalyticsModel = mongoose.model<IPageAnalytics>("PageAnalytics", pageAnalyticsSchema);

