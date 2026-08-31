import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { pageAnalyticsControllers } from "./pageAnalytics.controllers";

const router = Router();

// Public page view tracking (called on page mount by portfolio client)
router.post("/track", pageAnalyticsControllers.trackPage);

// Admin Analytics Endpoints
router.get("/stats", checkAuth, pageAnalyticsControllers.getAnalyticsStats);
router.get("/top-pages", checkAuth, pageAnalyticsControllers.getTopVisitedPages);
router.get("/logs", checkAuth, pageAnalyticsControllers.getAllLogs);

export const pageAnalyticsRoutes = router;
