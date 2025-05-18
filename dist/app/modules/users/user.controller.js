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
exports.userController = void 0;
const user_service_1 = require("./user.service");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = req.body;
    try {
        if (userInfo.provider !== "Email" && !userInfo.password) {
            userInfo.password = null;
        }
        const newUser = yield user_service_1.userServices.registerUser(userInfo);
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Error registering user.",
        });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_service_1.userServices.loginUser(req.body.email, req.body.password);
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
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
});
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_service_1.userServices.getUserById(req.params.id);
        res.json({
            success: true,
            user,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
});
exports.userController = {
    registerUser,
    login,
    getUserById,
};
