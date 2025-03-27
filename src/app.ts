import express, { Application, Request, Response } from "express";
const app: Application = express();
import cors from "cors";
import { userRoute } from "./app/modules/users/user.route";
import { messageRoute } from "./app/modules/messages/message.route";

app.use(express.json());
// app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(cors({ origin: "*", credentials: true }));

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.use("/api/v1/users", userRoute);
app.use("/api/v1/messages", messageRoute);

export default app;
