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
exports.skillsController = void 0;
const skills_service_1 = require("./skills.service");
const createSkills = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const techData = req.body;
        if (!techData.name || !techData.description || !techData.rating) {
            res.status(400).json({
                success: false,
                message: "Missing required fields: name, description, rating",
            });
            return;
        }
        const newTech = yield skills_service_1.skillServices.createSkills(techData);
        res.status(201).json({
            success: true,
            message: "Skills created successfully",
            data: newTech,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create Skills",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
const getSkills = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Skills = yield skills_service_1.skillServices.getAllSkills();
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch Skills",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
const getSkillsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const Skills = yield skills_service_1.skillServices.getSkillsById(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch Skills",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
const updateSkills = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedTech = yield skills_service_1.skillServices.updateSkills(id, updateData);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update Skills",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
const deleteSkills = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedTech = yield skills_service_1.skillServices.deleteSkills(id);
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete Skills",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.skillsController = {
    createSkills,
    getSkills,
    getSkillsById,
    updateSkills,
    deleteSkills,
};
