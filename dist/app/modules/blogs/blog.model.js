"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CodeSnippetSchema = new mongoose_1.Schema({
    language: { type: String, required: true },
    code: { type: String, required: true },
}, { _id: false });
const ContentDetailsSchema = new mongoose_1.Schema({
    paragraphs: { type: [String], required: true },
    keyPoints: { type: [String], required: true },
    codeSnippets: { type: [CodeSnippetSchema], default: [] },
}, { _id: false });
const SubsectionSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
}, { _id: false });
const BlogSectionSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    images: { type: [String], required: true },
    content: { type: String },
    subsections: { type: [SubsectionSchema], default: [] },
}, { _id: false });
const ExternalLinkSchema = new mongoose_1.Schema({
    label: { type: String, required: true },
    url: { type: String, required: true },
}, { _id: false });
const BlogPostSchema = new mongoose_1.Schema({
    authorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "user", required: true },
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
}, {
    timestamps: true,
    versionKey: false,
});
const BlogModel = (0, mongoose_1.model)("BlogPost", BlogPostSchema);
exports.default = BlogModel;
