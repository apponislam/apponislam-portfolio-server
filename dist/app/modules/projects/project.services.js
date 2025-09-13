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
exports.projectServices = void 0;
const project_model_1 = __importDefault(require("./project.model"));
const postProject = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const newProject = yield project_model_1.default.create(payload);
    return newProject;
});
const findAllProjects = (_a) => __awaiter(void 0, [_a], void 0, function* ({ page = 1, limit = 10, search = "", type }) {
    const filter = {};
    // Search filter
    if (search) {
        filter.$or = [{ companyName: { $regex: search, $options: "i" } }, { shortDescription: { $regex: search, $options: "i" } }, { "descriptionDetails.paragraphs": { $regex: search, $options: "i" } }];
    }
    // Type filter
    if (type) {
        filter.type = type;
    }
    const skip = (page - 1) * limit;
    const [projects, total] = yield Promise.all([project_model_1.default.find(filter).populate({ path: "userId", select: "-password" }).sort({ startDate: 1 }).skip(skip).limit(limit), project_model_1.default.countDocuments(filter)]);
    return {
        data: projects,
        meta: {
            page,
            limit,
            total,
        },
    };
});
const findProjectById = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.default.findById(projectId).populate({
        path: "userId",
        select: "-password",
    });
    return project;
});
const updateProject = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedProject = yield project_model_1.default.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).populate({
        path: "userId",
        select: "-password",
    });
    return updatedProject;
});
const deleteProject = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedProject = yield project_model_1.default.findByIdAndDelete(id);
    return deletedProject;
});
exports.projectServices = {
    postProject,
    findAllProjects,
    findProjectById,
    updateProject,
    deleteProject,
};
