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
exports.projectController = void 0;
const project_services_1 = require("./project.services");
const postProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, type, companyName, category, shortDescription, websiteLink, githubLink, techStack, startDate, endDate, companyLogoImg, descriptionDetails, pagesInfoArr } = req.body;
    console.log(req.body);
    if (!userId || !type || !companyName || !category || !shortDescription || !techStack || !startDate || !endDate || !companyLogoImg || !descriptionDetails || !pagesInfoArr) {
        res.status(400).json({
            success: false,
            message: "All required fields must be filled.",
        });
        return;
    }
    try {
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
        res.status(201).json({
            success: true,
            message: "Project created successfully.",
            data: newProject,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create project.",
        });
    }
});
const getAllProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield project_services_1.projectServices.findAllProjects();
        res.status(200).json({
            success: true,
            message: "Projects retrieved successfully.",
            data: messages,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve Projects.",
        });
    }
});
const getSingleProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = req.params.id;
        const project = yield project_services_1.projectServices.findProjectById(projectId);
        if (!project) {
            res.status(404).json({
                success: false,
                message: "Project not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Project retrieved successfully.",
            data: project,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve the project.",
        });
    }
});
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const payload = req.body;
    console.log("Update payload:", payload);
    if (!id) {
        res.status(400).json({
            success: false,
            message: "Project ID is required.",
        });
        return;
    }
    try {
        const requiredFields = ["type", "companyName", "shortDescription"];
        const missingFields = requiredFields.filter((field) => !payload[field]);
        if (missingFields.length > 0) {
            res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(", ")}`,
            });
            return;
        }
        const updatedProject = yield project_services_1.projectServices.updateProject(id, payload);
        if (!updatedProject) {
            res.status(404).json({
                success: false,
                message: "Project not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Project updated successfully.",
            data: updatedProject,
        });
    }
    catch (error) {
        console.error("Update error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update project.",
        });
    }
});
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({
            success: false,
            message: "Project ID is required.",
        });
        return;
    }
    try {
        const deletedProject = yield project_services_1.projectServices.deleteProject(id);
        if (!deletedProject) {
            res.status(404).json({
                success: false,
                message: "Project not found.",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Project deleted successfully.",
            data: deletedProject,
        });
    }
    catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete project.",
        });
    }
});
exports.projectController = {
    postProject,
    getAllProjects,
    getSingleProject,
    updateProject,
    deleteProject,
};
