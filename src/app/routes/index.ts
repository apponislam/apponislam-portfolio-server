import express from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { contactRoutes } from "../modules/contact/contact.routes";
import { pageAnalyticsRoutes } from "../modules/page-analytics/pageAnalytics.routes";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
