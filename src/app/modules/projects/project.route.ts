import express from "express";
import { projectController } from "./project.controller";

const router = express.Router();

router.post("/", projectController.postProject);
router.get("/", projectController.getAllProjects);
router.get("/:id", projectController.getSingleProject);
router.patch("/:id", projectController.updateProject);

export const projectRoute = router;
