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
exports.messageController = void 0;
const message_service_1 = require("./message.service");
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const mailer_1 = __importDefault(require("../../../utils/mailer"));
const thankYouMail_1 = require("../../../templates/thankYouMail");
const config_1 = __importDefault(require("../../../config"));
const contactNotfyForMe_1 = require("../../../templates/contactNotfyForMe");
const postMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, message, social } = req.body;
    if (!name || !email || !message) {
        throw new ApiError_1.default(400, "Name, email, and message are required.");
    }
    const newMessage = yield message_service_1.messageServices.postMessage({ name, email, message, social });
    (0, mailer_1.default)({
        to: email,
        subject: "Thank you for reaching out! - Appon Islam - Full Stack Web Developer",
        html: (0, thankYouMail_1.thankYouEmailTemplate)(name),
    });
    (0, mailer_1.default)({
        to: config_1.default.mail.smtp_user,
        subject: "New Contact Message Received",
        html: (0, contactNotfyForMe_1.adminNotificationEmailTemplate)(name, email, message, social),
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Message submitted successfully.",
        data: newMessage,
    });
}));
const getAllMessages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = yield message_service_1.messageServices.findAllMessages({ page, limit });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Messages retrieved successfully.",
        data: result.data,
        meta: result.meta,
    });
}));
exports.messageController = {
    postMessage,
    getAllMessages,
};
