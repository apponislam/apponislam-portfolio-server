import { Request, Response } from "express";
import { userServices } from "./user.service";

const registerUser = async (req: Request, res: Response) => {
    const userInfo = req.body;

    try {
        const newUser = await userServices.registerUser(userInfo);
        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user: newUser,
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Error registering user.",
        });
    }
};

export const userController = {
    registerUser,
};
