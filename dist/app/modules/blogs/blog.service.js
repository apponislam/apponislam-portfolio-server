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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogServices = void 0;
const blog_model_1 = __importDefault(require("./blog.model"));
const createBlogPost = (blogData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield blog_model_1.default.create(blogData);
});
const getAllBlogPosts = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield blog_model_1.default.find().populate({
        path: "authorId",
        select: "-password",
    });
});
const getBlogPostById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield blog_model_1.default.findById(id).populate({
        path: "authorId",
        select: "-password",
    });
});
const updateBlogPost = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield blog_model_1.default.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    }).populate({
        path: "authorId",
        select: "-password",
    });
});
const deleteBlogPost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield blog_model_1.default.findByIdAndDelete(id);
});
exports.blogServices = {
    createBlogPost,
    getAllBlogPosts,
    getBlogPostById,
    updateBlogPost,
    deleteBlogPost,
};
