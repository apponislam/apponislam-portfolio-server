import express from "express";
import { skillsController } from "./skills.controller";

const router = express.Router();

router.post("/", skillsController.createSkills);

router.get("/", skillsController.getSkills);

router.get("/:id", skillsController.getSkillsById);

router.patch("/:id", skillsController.updateSkills);

router.delete("/:id", skillsController.deleteSkills);

export const skillRoutes = router;
