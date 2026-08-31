"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const authorized_1 = __importDefault(require("../../middlewares/authorized"));
const activity_controllers_1 = require("./activity.controllers");
const router = (0, express_1.Router)();
router.get("/", auth_1.default, (0, authorized_1.default)(["ADMIN"]), activity_controllers_1.activityControllers.getAllActivities);
// Delete operations are restricted to ADMIN users only
router.delete("/", auth_1.default, (0, authorized_1.default)(["ADMIN"]), activity_controllers_1.activityControllers.clearActivities);
router.delete("/:id", auth_1.default, (0, authorized_1.default)(["ADMIN"]), activity_controllers_1.activityControllers.deleteActivity);
exports.activityRoutes = router;
