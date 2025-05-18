import { Request, Response } from "express";
import { skillServices } from "./skills.service";
import { ISkills } from "./skills.interface";

const createSkills = async (req: Request, res: Response) => {
    try {
        const techData: ISkills = req.body;

        if (!techData.name || !techData.description || !techData.rating) {
            res.status(400).json({
                success: false,
                message: "Missing required fields: name, description, rating",
            });
            return;
        }

        const newTech = await skillServices.createSkills(techData);

        res.status(201).json({
            success: true,
            message: "Skills created successfully",
            data: newTech,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create Skills",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const getSkills = async (req: Request, res: Response) => {
    try {
        const Skills = await skillServices.getAllSkills();

        if (!Skills || Skills.length === 0) {
            res.status(404).json({
                success: false,
                message: "No Skills found",
                data: [],
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Skills retrieved successfully",
            data: Skills,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch Skills",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const getSkillsById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const Skills = await skillServices.getSkillsById(id);

        if (!Skills) {
            res.status(404).json({
                success: false,
                message: "Skills not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Skills retrieved successfully",
            data: Skills,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch Skills",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const updateSkills = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedTech = await skillServices.updateSkills(id, updateData);

        if (!updatedTech) {
            res.status(404).json({
                success: false,
                message: "Skills not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Skills updated successfully",
            data: updatedTech,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update Skills",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const deleteSkills = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedTech = await skillServices.deleteSkills(id);

        if (!deletedTech) {
            res.status(404).json({
                success: false,
                message: "Skills not found",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Skills deleted successfully",
            data: deletedTech,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete Skills",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const skillsController = {
    createSkills,
    getSkills,
    getSkillsById,
    updateSkills,
    deleteSkills,
};
