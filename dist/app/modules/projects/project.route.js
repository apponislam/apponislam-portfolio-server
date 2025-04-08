"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRoute = void 0;
const express_1 = __importDefault(require("express"));
const project_controller_1 = require("./project.controller");
const router = express_1.default.Router();
router.post("/", project_controller_1.projectController.postProject);
router.get("/", project_controller_1.projectController.getAllProjects);
router.get("/:id", project_controller_1.projectController.getSingleProject);
exports.projectRoute = router;
