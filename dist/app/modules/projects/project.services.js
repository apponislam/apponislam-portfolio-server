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
const findAllProjects = () => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield project_model_1.default.find().populate({
        path: "userId",
        select: "-password",
    });
    return messages;
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
