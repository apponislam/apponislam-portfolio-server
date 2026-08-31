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
exports.pageAnalyticsControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const pageAnalytics_services_1 = require("./pageAnalytics.services");
const trackPage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const rawIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip || "127.0.0.1";
    const ipAddress = Array.isArray(rawIp) ? rawIp[0] : rawIp.split(",")[0].trim();
    const userAgent = req.headers["user-agent"] || "";
    const path = req.body.path || req.headers["referer"] || "/";
    const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id) || req.body.userId;
    const result = yield pageAnalytics_services_1.pageAnalyticsServices.trackPageView({
        path,
        ipAddress,
        userAgent,
        userId,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Page view recorded successfully",
        data: result,
    });
}));
const getAnalyticsStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const days = req.query.days ? Number(req.query.days) : 30;
    const result = yield pageAnalytics_services_1.pageAnalyticsServices.getPageAnalyticsStats(days);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Page analytics stats retrieved successfully",
        data: result,
    });
}));
const getTopVisitedPages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const result = yield pageAnalytics_services_1.pageAnalyticsServices.getTopPages(limit);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Top visited pages retrieved successfully",
        data: result,
    });
}));
const getAllLogs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pageAnalytics_services_1.pageAnalyticsServices.getAllPageLogs(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Page analytics logs retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
exports.pageAnalyticsControllers = {
    trackPage,
    getAnalyticsStats,
    getTopVisitedPages,
    getAllLogs,
};
