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
exports.messageServices = void 0;
const message_model_1 = __importDefault(require("./message.model"));
const postMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newMessage = yield message_model_1.default.create(payload);
    return newMessage;
});
const findAllMessages = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* ({ page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const total = yield message_model_1.default.countDocuments();
    const messages = yield message_model_1.default.find().skip(skip).limit(limit);
    return {
        data: messages,
        meta: {
            page,
            limit,
            total,
        },
    };
});
exports.messageServices = {
    postMessage,
    findAllMessages,
};
