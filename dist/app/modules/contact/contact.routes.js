"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactRoutes = void 0;
const express_1 = __importDefault(require("express"));
const contact_controllers_1 = require("./contact.controllers");
const checkAuth_1 = __importDefault(require("../../middlewares/checkAuth"));
const router = express_1.default.Router();
router.post("/", contact_controllers_1.contactControllers.createContact);
router.get("/", checkAuth_1.default, contact_controllers_1.contactControllers.getAllContacts);
router.get("/:id", checkAuth_1.default, contact_controllers_1.contactControllers.getSingleContact);
router.post("/:id/reply", checkAuth_1.default, contact_controllers_1.contactControllers.replyContact);
router.patch("/:id/status", checkAuth_1.default, contact_controllers_1.contactControllers.updateContactStatus);
router.delete("/:id", checkAuth_1.default, contact_controllers_1.contactControllers.deleteContact);
exports.contactRoutes = router;
