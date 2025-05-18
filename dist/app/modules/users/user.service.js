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
exports.userServices = void 0;
const user_model_1 = require("./user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const registerUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, provider } = payload;
    const existingUser = yield user_model_1.userModel.findOne({ email });
    if (existingUser) {
        if (existingUser.provider === provider) {
            return existingUser;
        }
        else {
            throw new Error(`Email is already registered with ${existingUser.provider}.`);
        }
    }
    if (provider !== "Email") {
        delete payload.password;
    }
    const newUser = yield user_model_1.userModel.create(payload);
    return newUser;
});
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    // Find user
    const user = yield user_model_1.userModel.findOne({ email });
    if (!user)
        throw new Error("User not found");
    if (user.provider === "Email") {
        if (!user.password)
            throw new Error("Password not set");
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            throw new Error("Wrong password");
    }
    return user;
});
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.userModel.findById(id).lean();
    if (!user)
        throw new Error("User not found");
    delete user.password;
    return user;
});
exports.userServices = {
    registerUser,
    loginUser,
    getUserById,
};
