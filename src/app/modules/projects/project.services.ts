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

export const projectServices = {
    postProject,
    findAllProjects,
    findProjectById,
};
