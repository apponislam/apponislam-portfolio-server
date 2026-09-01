"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageAnalyticsServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const pageAnalytics_model_1 = require("./pageAnalytics.model");
const getTodayDateString = () => {
    return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
};
const trackPageView = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const dateStr = getTodayDateString();
    const cleanPath = payload.path || "/";
    const { ipAddress, userAgent, userId } = payload;
    const updateDoc = {
        $inc: { count: 1 },
        $set: {
            lastVisitedAt: new Date(),
            userAgent: userAgent || "",
        },
    };
    if (userId && mongoose_1.default.Types.ObjectId.isValid(userId)) {
        updateDoc.$set.userId = new mongoose_1.default.Types.ObjectId(userId);
    }
    // Fire and forget in background so API responds in <10ms
    setImmediate(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield pageAnalytics_model_1.PageAnalyticsModel.findOneAndUpdate({ date: dateStr, path: cleanPath, ipAddress }, updateDoc, { upsert: true, setDefaultsOnInsert: true, runValidators: false });
        }
        catch (err) {
            console.error("Page view tracking error:", err);
        }
    }));
    return { recorded: true };
});
const getPageAnalyticsStats = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (days = 30) {
    var _a, _b, _c, _d;
    const todayStr = getTodayDateString();
    // Today's overall summary
    const todayStats = yield pageAnalytics_model_1.PageAnalyticsModel.aggregate([
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
    const todayTotalPageViews = ((_a = todayStats[0]) === null || _a === void 0 ? void 0 : _a.totalPageViews) || 0;
    const todayUniqueVisitors = ((_b = todayStats[0]) === null || _b === void 0 ? void 0 : _b.uniqueVisitors) || 0;
    // All-time overall summary
    const allTimeStats = yield pageAnalytics_model_1.PageAnalyticsModel.aggregate([
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
    const totalPageViews = ((_c = allTimeStats[0]) === null || _c === void 0 ? void 0 : _c.totalPageViews) || 0;
    const totalUniqueVisitors = ((_d = allTimeStats[0]) === null || _d === void 0 ? void 0 : _d.uniqueVisitors) || 0;
    // Top pages summary for stats overview
    const topPages = yield getTopPages(5);
    // Daily trend for past N days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    const startDateStr = startDate.toISOString().split("T")[0];
    const dailyBreakdown = yield pageAnalytics_model_1.PageAnalyticsModel.aggregate([
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
});
const getTopPages = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (limit = 10) {
    const topPages = yield pageAnalytics_model_1.PageAnalyticsModel.aggregate([
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
});
const getAllPageLogs = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 10, path, date, searchTerm } = query;
    const filter = {};
    if (path)
        filter.path = path;
    if (date)
        filter.date = date;
    if (searchTerm) {
        filter.$or = [
            { path: { $regex: searchTerm, $options: "i" } },
            { ipAddress: { $regex: searchTerm, $options: "i" } },
            { userAgent: { $regex: searchTerm, $options: "i" } },
        ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [logs, total] = yield Promise.all([
        pageAnalytics_model_1.PageAnalyticsModel.find(filter)
            .populate("userId", "name email phone profileImage")
            .sort({ lastVisitedAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        pageAnalytics_model_1.PageAnalyticsModel.countDocuments(filter),
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
});
exports.pageAnalyticsServices = {
    trackPageView,
    getPageAnalyticsStats,
    getTopPages,
    getAllPageLogs,
};
