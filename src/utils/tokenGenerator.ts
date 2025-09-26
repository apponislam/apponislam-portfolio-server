import crypto from "crypto";

export const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    return { otp, expiry };
};

export const generateVerificationToken = (hours = 24) => {
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + hours * 60 * 60 * 1000);
    return { token, expiry };
};
