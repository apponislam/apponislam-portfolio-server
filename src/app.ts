import express, { Application, Request, Response } from "express";
const app: Application = express();
import cors from "cors";
import router from "./routes";
import notFound from "./errors/notFound";
import globalErrorHandler from "./errors/globalErrorhandler";
import cookieParser from "cookie-parser";

app.use(cookieParser());
app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:3000", "https://apponislam-portfolio-with-next-js.vercel.app", "https://apponislam.4ppon.com"],
        credentials: true,
    })
);

app.get("/", (req: Request, res: Response) => {
    res.sendFile("public/index.html", { root: "." });
});

app.use("/api/v1", router);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
