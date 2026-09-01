import mongoose from "mongoose";
import { PageAnalyticsModel } from "./pageAnalytics.model";

const getTodayDateString = (): string => {
    return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
};

const trackPageView = async (payload: {
    path?: string;
    ipAddress: string;
    userAgent?: string;
    userId?: string;
}) => {
    const dateStr = getTodayDateString();
    const cleanPath = payload.path || "/";
    const { ipAddress, userAgent, userId } = payload;

    const updateDoc: any = {
        $inc: { count: 1 },
        $set: {
            lastVisitedAt: new Date(),
            userAgent: userAgent || "",
        },
    };

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        updateDoc.$set.userId = new mongoose.Types.ObjectId(userId);
    }

    // Fire and forget in background so API responds in <10ms
    setImmediate(async () => {
        try {
            await PageAnalyticsModel.findOneAndUpdate(
                { date: dateStr, path: cleanPath, ipAddress },
                updateDoc,
                { upsert: true, setDefaultsOnInsert: true, runValidators: false }
            );
        } catch (err) {
            console.error("Page view tracking error:", err);
        }
    });

    return { recorded: true };
};

const getPageAnalyticsStats = async (days = 30) => {
    const todayStr = getTodayDateString();

    // Today's overall summary
    const todayStats = await PageAnalyticsModel.aggregate([
        { $match: { date: todayStr } },
        {
            $group: {
                _id: null,
                totalPageViews: { $sum: "$count" },
                uniqueIPs: { $addToSet: "$ipAddress" },
            },
        },
        {
            $project: {
                totalPageViews: 1,
                uniqueVisitors: { $size: "$uniqueIPs" },
            },
        },
    ]);

    const todayTotalPageViews = todayStats[0]?.totalPageViews || 0;
    const todayUniqueVisitors = todayStats[0]?.uniqueVisitors || 0;

    // All-time overall summary
    const allTimeStats = await PageAnalyticsModel.aggregate([
        {
            $group: {
                _id: null,
                totalPageViews: { $sum: "$count" },
                uniqueIPs: { $addToSet: "$ipAddress" },
            },
        },
        {
            $project: {
                totalPageViews: 1,
                uniqueVisitors: { $size: "$uniqueIPs" },
            },
        },
    ]);

    const totalPageViews = allTimeStats[0]?.totalPageViews || 0;
    const totalUniqueVisitors = allTimeStats[0]?.uniqueVisitors || 0;

    // Top pages summary for stats overview
    const topPages = await getTopPages(5);

    // Daily trend for past N days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    const startDateStr = startDate.toISOString().split("T")[0];

    const dailyBreakdown = await PageAnalyticsModel.aggregate([
        { $match: { date: { $gte: startDateStr } } },
        {
            $group: {
                _id: "$date",
                totalPageViews: { $sum: "$count" },
                uniqueIPs: { $addToSet: "$ipAddress" },
            },
        },
        {
            $project: {
                _id: 1,
                totalPageViews: 1,
                uniqueVisitors: { $size: "$uniqueIPs" },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    const dailyTrend = dailyBreakdown.map((item) => ({
        date: item._id,
        totalPageViews: item.totalPageViews,
        uniqueVisitors: item.uniqueVisitors,
    }));

    return {
        todayTotalPageViews,
        todayUniqueVisitors,
        totalPageViews,
        totalUniqueVisitors,
        topPages,
        dailyTrend,
    };
};

const getTopPages = async (limit = 10) => {
    const topPages = await PageAnalyticsModel.aggregate([
        {
            $group: {
                _id: "$path",
                totalViews: { $sum: "$count" },
                uniqueIPs: { $addToSet: "$ipAddress" },
            },
        },
        { $sort: { totalViews: -1 } },
        { $limit: Number(limit) },
        {
            $project: {
                _id: 0,
                path: "$_id",
                totalViews: 1,
                uniqueVisitors: { $size: "$uniqueIPs" },
            },
        },
    ]);

    return topPages;
};

const getAllPageLogs = async (query: {
    page?: string;
    limit?: string;
    path?: string;
    date?: string;
    searchTerm?: string;
}) => {
    const { page = 1, limit = 10, path, date, searchTerm } = query;
    const filter: any = {};

    if (path) filter.path = path;
    if (date) filter.date = date;
    if (searchTerm) {
        filter.$or = [
            { path: { $regex: searchTerm, $options: "i" } },
            { ipAddress: { $regex: searchTerm, $options: "i" } },
            { userAgent: { $regex: searchTerm, $options: "i" } },
        ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
        PageAnalyticsModel.find(filter)
            .populate("userId", "name email phone profileImage")
            .sort({ lastVisitedAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        PageAnalyticsModel.countDocuments(filter),
    ]);

    return {
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
            hasNext: Number(page) * Number(limit) < total,
            hasPrev: Number(page) > 1,
        },
        data: logs,
    };
};

export const pageAnalyticsServices = {
    trackPageView,
    getPageAnalyticsStats,
    getTopPages,
    getAllPageLogs,
};
