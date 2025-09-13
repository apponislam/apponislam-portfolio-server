import { Request, Response } from "express";
import { projectServices } from "./project.services";
import sendResponse from "../../../utils/sendResponse";
import catchAsync from "../../../utils/catchAsync";
import ApiError from "../../../errors/ApiError";

const postProject = catchAsync(async (req: Request, res: Response) => {
    const { userId, type, companyName, category, shortDescription, websiteLink, githubLink, techStack, startDate, endDate, companyLogoImg, descriptionDetails, pagesInfoArr } = req.body;

    console.log("Create project payload:", req.body);

    // Required fields check
    const requiredFields = ["userId", "type", "companyName", "category", "shortDescription", "techStack", "startDate", "endDate", "companyLogoImg", "descriptionDetails", "pagesInfoArr"];

    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
        throw new ApiError(400, `Missing required fields: ${missingFields.join(", ")}`);
    }

    const newProject = await projectServices.postProject({
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

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Project created successfully.",
        data: newProject,
    });
});

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || "";
    const type = (req.query.type as "Personal Project" | "Professional") || undefined;

    const result = await projectServices.findAllProjects({ page, limit, search, type });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Projects retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getSingleProject = catchAsync(async (req: Request, res: Response) => {
    const projectId = req.params.id;

    const project = await projectServices.findProjectById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found.");
    }

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Project retrieved successfully.",
        data: project,
    });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    console.log("Update payload:", payload);

    if (!id) {
        throw new ApiError(400, "Project ID is required.");
    }

    // Check required fields
    const requiredFields = ["type", "companyName", "shortDescription"];
    const missingFields = requiredFields.filter((field) => !payload[field]);

    if (missingFields.length > 0) {
        throw new ApiError(400, `Missing required fields: ${missingFields.join(", ")}`);
    }

    const updatedProject = await projectServices.updateProject(id, payload);

    if (!updatedProject) {
        throw new ApiError(404, "Project not found.");
    }

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Project updated successfully.",
        data: updatedProject,
    });
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Project ID is required.");
    }

    const deletedProject = await projectServices.deleteProject(id);

    if (!deletedProject) {
        throw new ApiError(404, "Project not found.");
    }

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Project deleted successfully.",
        data: deletedProject,
    });
});

export const projectController = {
    postProject,
    getAllProjects,
    getSingleProject,
    updateProject,
    deleteProject,
};
