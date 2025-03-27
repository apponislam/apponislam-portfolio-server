import { Request, Response } from "express";
import { messageServices } from "./message.service";

const postMessage = async (req: Request, res: Response) => {
    const { name, email, message, social } = req.body;

    if (!name || !email || !message) {
        res.status(400).json({
            success: false,
            message: "Name, email, and message are required.",
        });
    }

    try {
        const newMessage = await messageServices.postMessage({ name, email, message, social });
        res.status(201).json({
            success: true,
            message: "Message submitted successfully.",
            data: newMessage,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to submit message.",
        });
    }
};

const getAllMessages = async (req: Request, res: Response) => {
    try {
        const messages = await messageServices.findAllMessages();
        res.status(200).json({
            success: true,
            message: "Messages retrieved successfully.",
            data: messages,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve messages.",
        });
    }
};

export const messageController = {
    postMessage,
    getAllMessages,
};
