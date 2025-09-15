import { Request, Response } from "express";
import { skillServices } from "./skills.service";
import { ISkills } from "./skills.interface";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import ApiError from "../../../errors/ApiError";
import sendResponse from "../../../utils/sendResponse";

const createSkills = catchAsync(async (req: Request, res: Response) => {
    const techData: ISkills = req.body;

    if (!techData.name || !techData.description || !techData.rating) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Missing required fields: name, description, rating");
    }

    const newTech = await skillServices.createSkills(techData);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Skills created successfully",
        data: newTech,
    });
});

const getSkills = catchAsync(async (req: Request, res: Response) => {
    const Skills = await skillServices.getAllSkills();

    if (!Skills || Skills.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, "No Skills found");
    }

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Skills retrieved successfully",
        data: Skills,
    });
});

const getSkillsById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const Skills = await skillServices.getSkillsById(id);

    if (!Skills) {
        throw new ApiError(httpStatus.NOT_FOUND, "Skills not found");
    }

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Skills retrieved successfully",
        data: Skills,
    });
});

const updateSkills = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const updatedTech = await skillServices.updateSkills(id, updateData);

    if (!updatedTech) {
        throw new ApiError(httpStatus.NOT_FOUND, "Skills not found");
    }

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Skills updated successfully",
        data: updatedTech,
    });
});

const deleteSkills = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedTech = await skillServices.deleteSkills(id);

    if (!deletedTech) {
        throw new ApiError(httpStatus.NOT_FOUND, "Skills not found");
    }

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Skills deleted successfully",
        data: deletedTech,
    });
});

export const skillsController = {
    createSkills,
    getSkills,
    getSkillsById,
    updateSkills,
    deleteSkills,
};
