import express from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { contactRoutes } from "../modules/contact/contact.routes";
import { pageAnalyticsRoutes } from "../modules/page-analytics/pageAnalytics.routes";
import { activityRoutes } from "../modules/activity/activity.routes";

const router = express.Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: authRoutes,
    },
    {
        path: "/contacts",
        route: contactRoutes,
    },
    {
        path: "/page-analytics",
        route: pageAnalyticsRoutes,
    },
    {
        path: "/activities",
        route: activityRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
