import { ISkills } from "./skills.interface";
import { slillsModel } from "./skills.model";

const createSkills = async (techData: ISkills) => {
    return await slillsModel.create(techData);
};

const getAllSkills = async () => {
    return await slillsModel.find().sort({ createdAt: -1 });
};

const getSkillsById = async (id: string) => {
    return await slillsModel.findById(id);
};

const updateSkills = async (id: string, updateData: Partial<ISkills>) => {
    return await slillsModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
};

const deleteSkills = async (id: string) => {
    return await slillsModel.findByIdAndDelete(id);
};

export const skillServices = {
    createSkills,
    getAllSkills,
    getSkillsById,
    updateSkills,
    deleteSkills,
};
