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
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageController = void 0;
const message_service_1 = require("./message.service");
const postMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, message, social } = req.body;
    if (!name || !email || !message) {
        res.status(400).json({
            success: false,
            message: "Name, email, and message are required.",
        });
    }
    try {
        const newMessage = yield message_service_1.messageServices.postMessage({ name, email, message, social });
        res.status(201).json({
            success: true,
            message: "Message submitted successfully.",
            data: newMessage,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to submit message.",
        });
    }
});
const getAllMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield message_service_1.messageServices.findAllMessages();
        res.status(200).json({
            success: true,
            message: "Messages retrieved successfully.",
            data: messages,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve messages.",
        });
    }
});
exports.messageController = {
    postMessage,
    getAllMessages,
};
