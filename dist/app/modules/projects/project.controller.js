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
exports.projectController = void 0;
const project_services_1 = require("./project.services");
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const postProject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, type, companyName, category, shortDescription, websiteLink, githubLink, techStack, startDate, endDate, companyLogoImg, descriptionDetails, pagesInfoArr } = req.body;
    console.log("Create project payload:", req.body);
    // Required fields check
    const requiredFields = ["userId", "type", "companyName", "category", "shortDescription", "techStack", "startDate", "endDate", "companyLogoImg", "descriptionDetails", "pagesInfoArr"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
        throw new ApiError_1.default(400, `Missing required fields: ${missingFields.join(", ")}`);
    }
    const newProject = yield project_services_1.projectServices.postProject({
        userId,
        type,
        companyName,
        category,
        shortDescription,
        websiteLink,
        githubLink,
        techStack,
        startDate,
        endDate,
        companyLogoImg,
        descriptionDetails,
        pagesInfoArr,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Project created successfully.",
        data: newProject,
    });
}));
const getAllProjects = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const type = req.query.type || undefined;
    const result = yield project_services_1.projectServices.findAllProjects({ page, limit, search, type });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Projects retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getSingleProject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projectId = req.params.id;
    const project = yield project_services_1.projectServices.findProjectById(projectId);
    if (!project) {
        throw new ApiError_1.default(404, "Project not found.");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Project retrieved successfully.",
        data: project,
    });
}));
const updateProject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    console.log("Update payload:", payload);
    if (!id) {
        throw new ApiError_1.default(400, "Project ID is required.");
    }
    // Check required fields
    const requiredFields = ["type", "companyName", "shortDescription"];
    const missingFields = requiredFields.filter((field) => !payload[field]);
    if (missingFields.length > 0) {
        throw new ApiError_1.default(400, `Missing required fields: ${missingFields.join(", ")}`);
    }
    const updatedProject = yield project_services_1.projectServices.updateProject(id, payload);
    if (!updatedProject) {
        throw new ApiError_1.default(404, "Project not found.");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Project updated successfully.",
        data: updatedProject,
    });
}));
const deleteProject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        throw new ApiError_1.default(400, "Project ID is required.");
    }
    const deletedProject = yield project_services_1.projectServices.deleteProject(id);
    if (!deletedProject) {
        throw new ApiError_1.default(404, "Project not found.");
    }
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Project deleted successfully.",
        data: deletedProject,
    });
}));
exports.projectController = {
    postProject,
    getAllProjects,
    getSingleProject,
    updateProject,
    deleteProject,
};
