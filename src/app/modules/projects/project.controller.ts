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

export const projectController = {
    postProject,
    getAllProjects,
};
