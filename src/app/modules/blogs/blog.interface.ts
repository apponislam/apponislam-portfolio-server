import { Types } from "mongoose";
export interface IBlogContentDetails {
    paragraphs: string[];
    keyPoints: string[];
    codeSnippets?: {
        language: string;
        code: string;
    }[];
}

export interface IBlogSection {
    title: string;
    images: string[];
    content?: string;
    subsections?: {
        title: string;
        text: string;
    }[];
}

export interface IBlogPost {
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
