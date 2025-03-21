import express, { Application, Request, Response } from "express";
const app: Application = express();
import cors from "cors";
import { userRoute } from "./app/modules/users/user.route";

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.use("/api/v1/users", userRoute);

export default app;
