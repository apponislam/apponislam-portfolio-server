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
// utils/mailer.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const transporter = nodemailer_1.default.createTransport({
    host: config_1.default.mail.smtp_host,
    port: Number(config_1.default.mail.smtp_port),
    secure: Number(config_1.default.mail.smtp_port) === 465,
    auth: {
        user: config_1.default.mail.smtp_user,
        pass: config_1.default.mail.smtp_pass,
    },
});
const sendMail = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (options = {}) {
    const { to, subject, html, text, from } = options;
    try {
        const info = yield transporter.sendMail({
            from: from || `"Appon Islam" <${config_1.default.mail.smtp_user}>`,
            to,
            subject: subject || "Notification from Appon Islam",
            html,
            text,
        });
        console.log(`✅ Email sent successfully: ${info.messageId} to ${to}`);
        return true;
    }
    catch (err) {
        console.error("❌ Failed to send email:", err);
        return false;
    }
});
exports.default = sendMail;
