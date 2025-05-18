import { IBlogPost } from "./blog.interface";
import BlogModel from "./blog.model";

const createBlogPost = async (blogData: IBlogPost) => {
    return await BlogModel.create(blogData);
};

const getAllBlogPosts = async () => {
    return await BlogModel.find().populate({
        path: "authorId",
        select: "-password",
    });
};

const getBlogPostById = async (id: string) => {
    return await BlogModel.findById(id).populate({
        path: "authorId",
        select: "-password",
    });
};

const updateBlogPost = async (id: string, updateData: Partial<IBlogPost>) => {
    return await BlogModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    }).populate({
        path: "authorId",
        select: "-password",
    });
};

const deleteBlogPost = async (id: string) => {
    return await BlogModel.findByIdAndDelete(id);
};

export const blogServices = {
    createBlogPost,
    getAllBlogPosts,
    getBlogPostById,
    updateBlogPost,
    deleteBlogPost,
};
