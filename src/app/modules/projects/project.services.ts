import projectsModel from "./project.model";
import { IProjectsInterface } from "./project.interface";

const postProject = async (payload: IProjectsInterface) => {
    const newProject = await projectsModel.create(payload);
    return newProject;
};

const findAllProjects = async () => {
    const messages = await projectsModel.find().populate({
        path: "userId",
        select: "-password",
    });
    return messages;
};

const findProjectById = async (projectId: string) => {
    const project = await projectsModel.findById(projectId).populate({
        path: "userId",
        select: "-password",
    });

    return project;
};

const updateProject = async (id: string, payload: Partial<IProjectsInterface>) => {
    const updatedProject = await projectsModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).populate({
        path: "userId",
        select: "-password",
    });
    return updatedProject;
};

export const projectServices = {
    postProject,
    findAllProjects,
    findProjectById,
    updateProject,
};
