import projectsModel from "./project.model";
import { IProjectsInterface } from "./project.interface";

const postProject = async (payload: IProjectsInterface) => {
    const newProject = await projectsModel.create(payload);
    return newProject;
};

interface FindAllOptions {
    page?: number;
    limit?: number;
    search?: string;
    type?: "Personal Project" | "Professional";
}

const findAllProjects = async ({ page = 1, limit = 10, search = "", type }: FindAllOptions) => {
    const filter: Record<string, any> = {};

    // Search filter
    if (search) {
        filter.$or = [{ companyName: { $regex: search, $options: "i" } }, { shortDescription: { $regex: search, $options: "i" } }, { "descriptionDetails.paragraphs": { $regex: search, $options: "i" } }];
    }

    // Type filter
    if (type) {
        filter.type = type;
    }

    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([projectsModel.find(filter).populate({ path: "userId", select: "-password" }).sort({ startDate: 1 }).skip(skip).limit(limit), projectsModel.countDocuments(filter)]);

    return {
        data: projects,
        meta: {
            page,
            limit,
            total,
        },
    };
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

const deleteProject = async (id: string) => {
    const deletedProject = await projectsModel.findByIdAndDelete(id);
    return deletedProject;
};

export const projectServices = {
    postProject,
    findAllProjects,
    findProjectById,
    updateProject,
    deleteProject,
};
