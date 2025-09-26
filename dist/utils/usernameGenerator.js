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
exports.generateUniqueUsername = void 0;
const slugify_1 = __importDefault(require("slugify"));
const auth_model_1 = require("../app/modules/auth/auth.model");
const generateUniqueUsername = (fullName) => __awaiter(void 0, void 0, void 0, function* () {
    const baseUsername = (0, slugify_1.default)(fullName, { lower: true, strict: true });
    let username = baseUsername;
    let counter = 1;
    while (yield auth_model_1.AuthModel.findOne({ username })) {
        username = `${baseUsername}-${counter}`;
        counter++;
    }
    return username;
});
exports.generateUniqueUsername = generateUniqueUsername;
