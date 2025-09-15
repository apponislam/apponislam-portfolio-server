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
exports.skillsController = void 0;
const skills_service_1 = require("./skills.service");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const createSkills = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const techData = req.body;
    if (!techData.name || !techData.description || !techData.rating) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Missing required fields: name, description, rating");
    }
    const newTech = yield skills_service_1.skillServices.createSkills(techData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Skills created successfully",
        data: newTech,
    });
}));
const getSkills = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Skills = yield skills_service_1.skillServices.getAllSkills();
    if (!Skills || Skills.length === 0) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No Skills found");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Skills retrieved successfully",
        data: Skills,
    });
}));
const getSkillsById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const Skills = yield skills_service_1.skillServices.getSkillsById(id);
    if (!Skills) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Skills not found");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Skills retrieved successfully",
        data: Skills,
    });
}));
const updateSkills = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = req.body;
    const updatedTech = yield skills_service_1.skillServices.updateSkills(id, updateData);
    if (!updatedTech) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Skills not found");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Skills updated successfully",
        data: updatedTech,
    });
}));
const deleteSkills = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedTech = yield skills_service_1.skillServices.deleteSkills(id);
    if (!deletedTech) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Skills not found");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Skills deleted successfully",
        data: deletedTech,
    });
}));
exports.skillsController = {
    createSkills,
    getSkills,
    getSkillsById,
    updateSkills,
    deleteSkills,
};
