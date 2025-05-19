import express, { Application, Request, Response } from "express";
const app: Application = express();
import cors from "cors";
import { userRoute } from "./app/modules/users/user.route";
import { messageRoute } from "./app/modules/messages/message.route";
import { projectRoute } from "./app/modules/projects/project.route";
import { blogRoute } from "./app/modules/blogs/blog.route";
import { skillRoutes } from "./app/modules/skills/skills.route";

app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:3000", "https://apponislam-portfolio-with-next-js.vercel.app"],
        credentials: true,
    })
);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.use("/api/v1/users", userRoute);
app.use("/api/v1/messages", messageRoute);
app.use("/api/v1/project", projectRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/skills", skillRoutes);

export default app;
