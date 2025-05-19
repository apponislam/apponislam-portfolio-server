"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const user_route_1 = require("./app/modules/users/user.route");
const message_route_1 = require("./app/modules/messages/message.route");
const project_route_1 = require("./app/modules/projects/project.route");
const blog_route_1 = require("./app/modules/blogs/blog.route");
const skills_route_1 = require("./app/modules/skills/skills.route");
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://apponislam-portfolio-with-next-js.vercel.app"],
    credentials: true,
}));
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/api/v1/users", user_route_1.userRoute);
app.use("/api/v1/messages", message_route_1.messageRoute);
app.use("/api/v1/project", project_route_1.projectRoute);
app.use("/api/v1/blog", blog_route_1.blogRoute);
app.use("/api/v1/skills", skills_route_1.skillRoutes);
exports.default = app;
