"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageAnalyticsRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = __importDefault(require("../../middlewares/checkAuth"));
const pageAnalytics_controllers_1 = require("./pageAnalytics.controllers");
const router = (0, express_1.Router)();
// Public page view tracking (called on page mount by portfolio client)
router.post("/track", pageAnalytics_controllers_1.pageAnalyticsControllers.trackPage);
// Admin Analytics Endpoints
router.get("/stats", checkAuth_1.default, pageAnalytics_controllers_1.pageAnalyticsControllers.getAnalyticsStats);
router.get("/top-pages", checkAuth_1.default, pageAnalytics_controllers_1.pageAnalyticsControllers.getTopVisitedPages);
router.get("/logs", checkAuth_1.default, pageAnalytics_controllers_1.pageAnalyticsControllers.getAllLogs);
exports.pageAnalyticsRoutes = router;
