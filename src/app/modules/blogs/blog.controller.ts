import { Request, Response } from "express";
import { blogServices } from "./blog.service";
import { IBlogPost } from "./blog.interface";

const createBlogPost = async (req: Request, res: Response) => {
    try {
        const blogData: IBlogPost = req.body;

        if (!blogData.authorId || !blogData.title || !blogData.contentDetails || !blogData.sections) {
            res.status(400).json({
                success: false,
                message: "Missing required fields: authorId, title, contentDetails, sections",
            });
            return;
        }

        const newBlog = await blogServices.createBlogPost(blogData);

        res.status(201).json({
            success: true,
            message: "Blog post created successfully",
            data: newBlog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create blog post",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const getBlogPosts = async (req: Request, res: Response) => {
    try {
        const blogs = await blogServices.getAllBlogPosts();

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
    } catch (error) {
        console.error("Error in getBlogPosts:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Failed to retrieve blog posts",
            error: process.env.NODE_ENV === "development" ? error : undefined,
        });
    }
};

const getBlogPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const blog = await blogServices.getBlogPostById(id);

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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve blog post",
        });
    }
};

const updateBlogPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedBlog = await blogServices.updateBlogPost(id, updateData);

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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update blog post",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const deleteBlogPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedBlog = await blogServices.deleteBlogPost(id);

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
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete blog post",
        });
    }
};

export const blogController = {
    createBlogPost,
    getBlogPosts,
    getBlogPost,
    updateBlogPost,
    deleteBlogPost,
};
