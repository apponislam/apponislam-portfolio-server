"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../app/modules/users/user.route");
const skills_route_1 = require("../app/modules/skills/skills.route");
const blog_route_1 = require("../app/modules/blogs/blog.route");
const project_route_1 = require("../app/modules/projects/project.route");
const message_route_1 = require("../app/modules/messages/message.route");
const auth_routes_1 = require("../app/modules/auth/auth.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_routes_1.authRoutes,
    },
    {
        path: "/users",
        route: user_route_1.userRoute,
    },
    {
        path: "/messages",
        route: message_route_1.messageRoute,
    },
    {
        path: "/project",
        route: project_route_1.projectRoute,
    },
    {
        path: "/blog",
        route: blog_route_1.blogRoute,
    },
    {
        path: "/skills",
        route: skills_route_1.skillRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
