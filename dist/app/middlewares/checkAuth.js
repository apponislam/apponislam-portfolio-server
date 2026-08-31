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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const config_1 = __importDefault(require("../config"));
const auth_model_1 = require("../modules/auth/auth.model");
/**
 * Middleware to extract user information from JWT token if present.
 * This will NOT throw an error if the token is missing, invalid, or expired.
 */
const checkAuth = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.headers.authorization;
    if (token === null || token === void 0 ? void 0 : token.startsWith("Bearer "))
        token = token.slice(7);
    if (!token) {
        return next();
    }
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    }
    catch (err) {
        return next();
    }
    const user = yield auth_model_1.UserModel.findOne({ _id: decoded._id, isDeleted: false });
    if (user && user.isActive && user.role === decoded.role) {
        req.user = user;
    }
    next();
}));
exports.default = checkAuth;
