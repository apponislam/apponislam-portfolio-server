import express from "express";
import { userRoute } from "../app/modules/users/user.route";
import { skillRoutes } from "../app/modules/skills/skills.route";
import { blogRoute } from "../app/modules/blogs/blog.route";
import { projectRoute } from "../app/modules/projects/project.route";
import { messageRoute } from "../app/modules/messages/message.route";
import { authRoutes } from "../app/modules/auth/auth.routes";

const router = express.Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: authRoutes,
    },
    {
        path: "/users",
        route: userRoute,
    },
    {
        path: "/messages",
        route: messageRoute,
    },
    {
        path: "/project",
        route: projectRoute,
    },
    {
        path: "/blog",
        route: blogRoute,
    },
    {
        path: "/skills",
        route: skillRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
