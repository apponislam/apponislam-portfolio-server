import { Schema, Types, model } from "mongoose";
import { IProjectsInterface } from "./project.interface";

// Schema for DescriptionDetails
const descriptionDetailsSchema = new Schema({
    paragraphs: {
        type: [String],
        required: true,
    },
    bullets: {
        type: [String],
        required: true,
    },
});

// Schema for PagesInfo
const pagesInfoSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    imgArr: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
    },
});

// Schema for IProjectsInterface
const projectsSchema = new Schema<IProjectsInterface>(
    {
        // id: {
        //     type: String,
        //     required: true,
        // },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        type: {
            type: String,
            enum: ["Personal Project", "Professional"],
            required: true,
        },
        companyName: {
            type: String,
            required: true,
        },
        category: {
            type: [String],
            enum: ["Full Stack", "Frontend", "Backend", "Web Dev"],
            required: true,
        },
        shortDescription: {
            type: String,
            required: true,
        },
        websiteLink: {
            type: String,
        },
        githubLink: {
            type: String,
        },
        techStack: {
            type: [String],
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        companyLogoImg: {
            type: String,
            required: true,
        },
        descriptionDetails: {
            type: descriptionDetailsSchema,
            required: true,
        },
        pagesInfoArr: {
            type: [pagesInfoSchema],
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Projects model creation with the IProjectsInterface type
const projectsModel = model<IProjectsInterface>("project", projectsSchema);

export default projectsModel;
