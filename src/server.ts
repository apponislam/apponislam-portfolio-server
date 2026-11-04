import http, { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import config from "./app/config";
import { seedAdmin } from "./app/modules/auth/auth.seed";
import { connectDB } from "./app/db";

let server: Server;

async function main() {
    try {
        await connectDB();
        server = http.createServer(app);

        await seedAdmin();

        server.listen(Number(config.port), config.ip, () => {
            console.log(`✅ App listening on port ${config.port} on ${config.ip}`);
        });
    } catch (err) {
        console.error("❌ DB Connection Failed:", err);
    }
}

// Only run server.listen in non-serverless environments (local development / standard Node host)
if (!process.env.VERCEL) {
    main();
}

const shutdown = (error?: any, exitCode = 1, signal?: string) => {
    if (error) console.error(`❌ ${signal || "Error"} detected:`, error);
    else if (signal) console.log(`⚠️ ${signal} received. Shutting down gracefully...`);

    if (server && server.listening) {
        server.close(async () => {
            console.log("✅ Server closed.");
            if (mongoose.connection.readyState === 1) {
                await mongoose.disconnect();
                console.log("✅ MongoDB disconnected.");
            }
            process.exit(exitCode);
        });

        setTimeout(() => {
            console.error("⚠️ Forcefully exiting");
            process.exit(exitCode);
        }, 5000);
    } else {
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

export default app;
