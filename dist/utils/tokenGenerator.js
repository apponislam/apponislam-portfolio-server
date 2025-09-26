"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationToken = exports.generateOtp = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    return { otp, expiry };
};
exports.generateOtp = generateOtp;
const generateVerificationToken = (hours = 24) => {
    const token = crypto_1.default.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + hours * 60 * 60 * 1000);
    return { token, expiry };
};
exports.generateVerificationToken = generateVerificationToken;
