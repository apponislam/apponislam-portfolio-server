import { Request, Response } from "express";
import { userServices } from "./user.service";

const registerUser = async (req: Request, res: Response) => {
    const userInfo = req.body;

    try {
        if (userInfo.provider !== "Email" && !userInfo.password) {
            userInfo.password = null;
        }

        const newUser = await userServices.registerUser(userInfo);

        console.log(newUser);

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user: {
                _id: newUser._id.toString(),
                name: newUser.name,
                email: newUser.email,
                image: newUser.image,
                provider: newUser.provider,
            },
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Error registering user.",
        });
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const user = await userServices.loginUser(req.body.email, req.body.password);
        res.json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                provider: user.provider,
            },
        });
    } catch (error: any) {
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await userServices.getUserById(req.params.id);
        res.json({
            success: true,
            user,
        });
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

export const userController = {
    registerUser,
    login,
    getUserById,
};
