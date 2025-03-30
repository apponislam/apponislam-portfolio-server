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
exports.projectController = {
    postProject,
    getAllProjects,
};
