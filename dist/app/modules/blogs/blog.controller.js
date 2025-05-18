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
exports.blogController = void 0;
const blog_service_1 = require("./blog.service");
const createBlogPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogData = req.body;
        if (!blogData.authorId || !blogData.title || !blogData.contentDetails || !blogData.sections) {
            res.status(400).json({
                success: false,
                message: "Missing required fields: authorId, title, contentDetails, sections",
            });
            return;
        }
        const newBlog = yield blog_service_1.blogServices.createBlogPost(blogData);
        res.status(201).json({
            success: true,
            message: "Blog post created successfully",
            data: newBlog,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create blog post",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
const getBlogPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield blog_service_1.blogServices.getAllBlogPosts();
        if (!blogs || blogs.length === 0) {
            res.status(404).json({
                success: false,
                message: "No blog posts found",
                data: [],
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Blog posts retrieved successfully",
            data: blogs,
        });
    }
    catch (error) {
        console.error("Error in getBlogPosts:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to retrieve blog posts",
            error: process.env.NODE_ENV === "development" ? error : undefined,
        });
    }
});
const getBlogPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const blog = yield blog_service_1.blogServices.getBlogPostById(id);
        if (!blog) {
            res.status(404).json({
                success: false,
                message: "Blog post not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Blog post retrieved successfully",
            data: blog,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve blog post",
        });
    }
});
const updateBlogPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedBlog = yield blog_service_1.blogServices.updateBlogPost(id, updateData);
        if (!updatedBlog) {
            res.status(404).json({
                success: false,
                message: "Blog post not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Blog post updated successfully",
            data: updatedBlog,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update blog post",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
const deleteBlogPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedBlog = yield blog_service_1.blogServices.deleteBlogPost(id);
        if (!deletedBlog) {
            res.status(404).json({
                success: false,
                message: "Blog post not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Blog post deleted successfully",
            data: deletedBlog,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete blog post",
        });
    }
});
exports.blogController = {
    createBlogPost,
    getBlogPosts,
    getBlogPost,
    updateBlogPost,
    deleteBlogPost,
};
