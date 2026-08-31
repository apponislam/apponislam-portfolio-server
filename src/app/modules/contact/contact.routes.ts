import express from "express";
import { contactControllers } from "./contact.controllers";
import checkAuth from "../../middlewares/checkAuth";

const router = express.Router();

router.post("/", contactControllers.createContact);

router.get("/", checkAuth, contactControllers.getAllContacts);
router.get("/:id", checkAuth, contactControllers.getSingleContact);

router.post("/:id/reply", checkAuth, contactControllers.replyContact);
router.patch("/:id/status", checkAuth, contactControllers.updateContactStatus);

router.delete("/:id", checkAuth, contactControllers.deleteContact);

export const contactRoutes = router;
