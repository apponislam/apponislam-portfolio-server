import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { pageAnalyticsServices } from "./pageAnalytics.services";

const trackPage = catchAsync(async (req: Request, res: Response) => {
    const rawIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip || "127.0.0.1";
    const ipAddress = Array.isArray(rawIp) ? rawIp[0] : (rawIp as string).split(",")[0].trim();
    const userAgent = req.headers["user-agent"] || "";
    const path = req.body.path || req.headers["referer"] || "/";
    const userId = (req as any).user?._id || req.body.userId;

    const result = await pageAnalyticsServices.trackPageView({
        path,
        ipAddress,
        userAgent,
        userId,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Page view recorded successfully",
        data: result,
    });
});

const getAnalyticsStats = catchAsync(async (req: Request, res: Response) => {
    const days = req.query.days ? Number(req.query.days) : 30;
    const result = await pageAnalyticsServices.getPageAnalyticsStats(days);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Page analytics stats retrieved successfully",
        data: result,
    });
});

const getTopVisitedPages = catchAsync(async (req: Request, res: Response) => {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const result = await pageAnalyticsServices.getTopPages(limit);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Top visited pages retrieved successfully",
        data: result,
    });
});

const getAllLogs = catchAsync(async (req: Request, res: Response) => {
    const result = await pageAnalyticsServices.getAllPageLogs(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Page analytics logs retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

export const pageAnalyticsControllers = {
    trackPage,
    getAnalyticsStats,
    getTopVisitedPages,
    getAllLogs,
};
