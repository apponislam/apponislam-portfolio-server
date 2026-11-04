import mongoose from "mongoose";
import dns from "dns";
import config from "./config";

// Only override DNS servers in local development.
// On Vercel / AWS Lambda, cloud internal DNS resolves SRV records natively,
// and hardcoding public DNS can cause UDP port 53 timeout issues in serverless containers.
if (!process.env.VERCEL && process.env.NODE_ENV !== "production") {
    try {
        dns.setServers(["8.8.8.8", "8.8.4.4"]);
    } catch (err) {
        console.warn("⚠️ Failed to set custom DNS servers:", err);
    }
}

let cachedConnection: typeof mongoose | null = null;
let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (): Promise<typeof mongoose> => {
    // Return existing active connection if already connected (readyState: 1 = connected)
    if (mongoose.connection.readyState === 1) {
        return mongoose;
    }

    // If a connection attempt is already in progress, await the existing promise
    if (connectionPromise) {
        return connectionPromise;
    }

    if (!config.mongodb_url) {
        throw new Error("MONGODB_URL is not defined in environment variables");
    }

    connectionPromise = mongoose
        .connect(config.mongodb_url, {
            serverSelectionTimeoutMS: 8000, // Fail fast after 8s if cluster is unreachable (e.g. IP whitelist)
        })
        .then((m) => {
            cachedConnection = m;
            return m;
        })
        .catch((err) => {
            connectionPromise = null;
            throw err;
        });

    return connectionPromise;
};
