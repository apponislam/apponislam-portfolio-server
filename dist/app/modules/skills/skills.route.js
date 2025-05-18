"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.skillRoutes = void 0;
const express_1 = __importDefault(require("express"));
const skills_controller_1 = require("./skills.controller");
const router = express_1.default.Router();
router.post("/", skills_controller_1.skillsController.createSkills);
router.get("/", skills_controller_1.skillsController.getSkills);
router.get("/:id", skills_controller_1.skillsController.getSkillsById);
router.patch("/:id", skills_controller_1.skillsController.updateSkills);
router.delete("/:id", skills_controller_1.skillsController.deleteSkills);
exports.skillRoutes = router;
