import { Types } from "mongoose";

export interface IPageAnalytics {
    _id?: Types.ObjectId;
    path: string;
    ipAddress: string;
    userId?: Types.ObjectId;
    userAgent?: string;
    date: string;
    count: number;
    lastVisitedAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
