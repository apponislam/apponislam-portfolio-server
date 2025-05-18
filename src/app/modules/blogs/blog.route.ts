import express from "express";
import { blogController } from "./blog.controller";

const router = express.Router();

router.post("/", blogController.createBlogPost);
router.get("/", blogController.getBlogPosts);
router.get("/:id", blogController.getBlogPost);
router.patch("/:id", blogController.updateBlogPost);
router.delete("/:id", blogController.deleteBlogPost);

export const blogRoute = router;
