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

export const projectServices = {
    postProject,
    findAllProjects,
};
