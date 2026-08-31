"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const notFound_1 = __importDefault(require("./errors/notFound"));
const globalErrorhandler_1 = __importDefault(require("./errors/globalErrorhandler"));
const routes_1 = __importDefault(require("./app/routes"));
const config_1 = __importDefault(require("./app/config"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:3001", "https://apponislam.top", "https://www.apponislam.top", "https://apponislam.com", "https://www.apponislam.com", "http://apponislam.com", "http://www.apponislam.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public"), { index: false }));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.get("/", (req, res) => {
    const indexPath = path_1.default.join(__dirname, "../public/index.html");
    fs_1.default.readFile(indexPath, "utf8", (err, html) => {
        if (err) {
            return res.status(500).send("Error loading status page");
        }
        const env = config_1.default.node_env || "production";
        const port = config_1.default.port || "5000";
        const formattedEnv = env.charAt(0).toUpperCase() + env.slice(1).toLowerCase();
        const modifiedHtml = html.replace("{{NODE_ENV}}", formattedEnv).replace("{{PORT}}", String(port));
        res.send(modifiedHtml);
    });
});
app.use("/api/v1", routes_1.default);
app.use(notFound_1.default);
app.use(globalErrorhandler_1.default);
exports.default = app;
