import { Request, Response } from "express";
import { messageServices } from "./message.service";
import catchAsync from "../../../utils/catchAsync";
import ApiError from "../../../errors/ApiError";
import sendResponse from "../../../utils/sendResponse";
import sendMail from "../../../utils/mailer";
import { thankYouEmailTemplate } from "../../../templates/thankYouMail";
import config from "../../../config";
import { adminNotificationEmailTemplate } from "../../../templates/contactNotfyForMe";

const postMessage = catchAsync(async (req: Request, res: Response) => {
    const { name, email, message, social } = req.body;

    if (!name || !email || !message) {
        throw new ApiError(400, "Name, email, and message are required.");
    }

    const newMessage = await messageServices.postMessage({ name, email, message, social });

    sendMail({
        to: email,
        subject: "Thank you for reaching out! - Appon Islam - Full Stack Web Developer",
        html: thankYouEmailTemplate(name),
    });

    sendMail({
        to: config.mail.smtp_user,
        subject: "New Contact Message Received",
        html: adminNotificationEmailTemplate(name, email, message, social),
    });

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Message submitted successfully.",
        data: newMessage,
    });
});

const getAllMessages = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await messageServices.findAllMessages({ page, limit });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Messages retrieved successfully.",
        data: result.data,
        meta: result.meta,
    });
});

export const messageController = {
    postMessage,
    getAllMessages,
};
