"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dns_1 = __importDefault(require("dns"));
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = __importDefault(require("http"));
const config_1 = __importDefault(require("./app/config"));
const auth_seed_1 = require("./app/modules/auth/auth.seed");
let server;
// Only set custom DNS if needed locally
try {
    dns_1.default.setServers(["8.8.8.8", "8.8.4.4"]);
}
catch (e) {
    // Ignore DNS override errors on cloud hosts like Vercel
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.mongodb_url, {
                maxPoolSize: 20,
                minPoolSize: 5,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            server = http_1.default.createServer(app_1.default);
            (0, auth_seed_1.seedAdmin)();
            server.listen(Number(config_1.default.port), config_1.default.ip, () => {
                console.log(`✅ App listening on port ${config_1.default.port} on ${config_1.default.ip}`);
            });
        }
        catch (err) {
            console.log("❌ DB Connection Failed:", err);
        }
    });
}
main();
const shutdown = (error, exitCode = 1, signal) => {
    if (error)
        console.error(`❌ ${signal || "Error"} detected:`, error);
    else if (signal)
        console.log(`⚠️ ${signal} received. Shutting down gracefully...`);
    if (server && server.listening) {
        server.close(() => __awaiter(void 0, void 0, void 0, function* () {
            console.log("✅ Server closed.");
            if (mongoose_1.default.connection.readyState === 1) {
                yield mongoose_1.default.disconnect();
                console.log("✅ MongoDB disconnected.");
            }
            process.exit(exitCode);
        }));
        setTimeout(() => {
            console.error("⚠️ Forcefully exiting");
            process.exit(exitCode);
        }, 5000);
    }
    else {
        process.exit(exitCode);
    }
};
process.on("unhandledRejection", (reason) => shutdown(reason, 1, "Unhandled Rejection"));
process.on("uncaughtException", (error) => shutdown(error, 1, "Uncaught Exception"));
process.on("SIGINT", () => shutdown(undefined, 0, "SIGINT"));
process.on("SIGTERM", () => shutdown(undefined, 0, "SIGTERM"));
process.on("warning", (warning) => {
    console.warn("⚠️ Node.js Warning:", warning.name, warning.message, warning.stack);
});
exports.default = app_1.default;
