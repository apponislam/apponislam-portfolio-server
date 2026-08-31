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
exports.sendEmailWithResend = exports.resend = void 0;
const resend_1 = require("resend");
const config_1 = __importDefault(require("../app/config"));
exports.resend = new resend_1.Resend(config_1.default.mail.resend_api_key);
/**
 * Send email via Resend API
 */
const sendEmailWithResend = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { to, subject, html, from, cc, bcc, replyTo, text } = payload;
    try {
        const data = yield exports.resend.emails.send(Object.assign(Object.assign(Object.assign(Object.assign({ from: from || config_1.default.mail.from_email, to: Array.isArray(to) ? to : [to], subject,
            html }, (cc && { cc: Array.isArray(cc) ? cc : [cc] })), (bcc && { bcc: Array.isArray(bcc) ? bcc : [bcc] })), (replyTo && { reply_to: replyTo })), (text && { text })));
        return data;
    }
    catch (error) {
        console.error("Resend Email error:", error);
        throw error;
    }
});
exports.sendEmailWithResend = sendEmailWithResend;
