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
exports.seedAdmin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_model_1 = require("./auth.model");
const config_1 = __importDefault(require("../../config"));
const seedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, phone } = config_1.default.initialAdmin || {};
        if (!email || !password || !name || !phone) {
            console.log("⚠️ Initial admin configuration missing in environment variables, skipping admin seeding");
            return;
        }
        const adminExists = yield auth_model_1.UserModel.findOne({
            role: "ADMIN",
        });
        if (!adminExists) {
            console.log("📝 No admin found, creating initial admin...");
            const hashedPassword = yield bcrypt_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
            const admin = {
                name,
                email,
                password: hashedPassword,
                role: "ADMIN",
                phone,
                isActive: true,
                isEmailVerified: true,
            };
            yield auth_model_1.UserModel.create(admin);
            console.log("✅ Admin created:", email);
        }
        else {
            console.log("✅ Admin already exists, skipping creation");
        }
    }
    catch (error) {
        console.error("❌ Error seeding admin:", error);
    }
});
exports.seedAdmin = seedAdmin;
