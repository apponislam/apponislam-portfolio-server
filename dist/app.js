"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const notFound_1 = __importDefault(require("./errors/notFound"));
const globalErrorhandler_1 = __importDefault(require("./errors/globalErrorhandler"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://apponislam-portfolio-with-next-js.vercel.app", "https://apponislam.4ppon.com"],
    credentials: true,
}));
app.get("/", (req, res) => {
    res.sendFile("public/index.html", { root: "." });
});
app.use("/api/v1", routes_1.default);
app.use(notFound_1.default);
app.use(globalErrorhandler_1.default);
exports.default = app;
