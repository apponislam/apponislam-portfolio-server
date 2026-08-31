"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../modules/auth/auth.routes");
const contact_routes_1 = require("../modules/contact/contact.routes");
const pageAnalytics_routes_1 = require("../modules/page-analytics/pageAnalytics.routes");
const activity_routes_1 = require("../modules/activity/activity.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.authRoutes,
    },
    {
        path: "/contacts",
        route: contact_routes_1.contactRoutes,
    },
    {
        path: "/page-analytics",
        route: pageAnalytics_routes_1.pageAnalyticsRoutes,
    },
    {
        path: "/activities",
        route: activity_routes_1.activityRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
