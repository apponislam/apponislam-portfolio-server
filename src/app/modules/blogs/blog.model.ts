import mongoose, { Schema, model, Document } from "mongoose";
import { Types } from "mongoose";

interface IBlogContentDetails {
    paragraphs: string[];
    keyPoints: string[];
    codeSnippets?: {
        language: string;
        code: string;
    }[];
}

interface IBlogSection {
    title: string;
    images: string[];
    content?: string;
    subsections?: {
        title: string;
        text: string;
    }[];
}

interface IBlogPost extends Document {
    authorId: Types.ObjectId;
    type: "Technical" | "Tutorial" | "Opinion" | "Case Study";
    title: string;
    categories: ("Web Dev" | "Mobile" | "DevOps" | "Career" | "Productivity")[];
    tags: string[];
    coverImage: string;
    contentDetails: IBlogContentDetails;
    sections: IBlogSection[];
    externalLinks?: {
        label: string;
        url: string;
    }[];
    repositoryUrl?: string;
}

const CodeSnippetSchema = new Schema(
    {
        language: { type: String, required: true },
        code: { type: String, required: true },
    },
    { _id: false }
);

const ContentDetailsSchema = new Schema(
    {
        paragraphs: { type: [String], required: true },
        keyPoints: { type: [String], required: true },
        codeSnippets: { type: [CodeSnippetSchema], default: [] },
    },
    { _id: false }
);

const SubsectionSchema = new Schema(
    {
        title: { type: String, required: true },
        text: { type: String, required: true },
    },
    { _id: false }
);

const BlogSectionSchema = new Schema(
    {
        title: { type: String, required: true },
        images: { type: [String], required: true },
        content: { type: String },
        subsections: { type: [SubsectionSchema], default: [] },
    },
    { _id: false }
);

const ExternalLinkSchema = new Schema(
    {
        label: { type: String, required: true },
        url: { type: String, required: true },
    },
    { _id: false }
);

const BlogPostSchema = new Schema<IBlogPost>(
    {
        authorId: { type: Schema.Types.ObjectId, ref: "user", required: true },
        type: { type: String, enum: ["Technical", "Tutorial", "Opinion", "Case Study"], required: true },
        title: { type: String, required: true },
        categories: {
            type: [String],
            enum: ["Web Dev", "Mobile", "DevOps", "Career", "Productivity"],
            required: true,
        },
        tags: { type: [String], required: true },
        coverImage: { type: String, required: true },
        contentDetails: { type: ContentDetailsSchema, required: true },
        sections: { type: [BlogSectionSchema], required: true },
        externalLinks: { type: [ExternalLinkSchema], default: [] },
        repositoryUrl: { type: String },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const BlogModel = model<IBlogPost>("BlogPost", BlogPostSchema);
export default BlogModel;
