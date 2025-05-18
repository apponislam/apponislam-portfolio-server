import { Request, Response } from "express";
import { projectServices } from "./project.services";

const postProject = async (req: Request, res: Response) => {
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

        res.status(201).json({
            success: true,
            message: "Project created successfully.",
            data: newProject,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create project.",
        });
    }
};

const getAllProjects = async (req: Request, res: Response) => {
    try {
        const messages = await projectServices.findAllProjects();
        res.status(200).json({
            success: true,
            message: "Projects retrieved successfully.",
            data: messages,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve Projects.",
        });
    }
};

const getSingleProject = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id;

        const project = await projectServices.findProjectById(projectId);

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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve the project.",
        });
    }
};

const updateProject = async (req: Request, res: Response) => {
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

        const updatedProject = await projectServices.updateProject(id, payload);

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
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update project.",
        });
    }
};

const deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({
            success: false,
            message: "Project ID is required.",
        });
        return;
    }

    try {
        const deletedProject = await projectServices.deleteProject(id);

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
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete project.",
        });
    }
};

export const projectController = {
    postProject,
    getAllProjects,
    getSingleProject,
    updateProject,
    deleteProject,
};
