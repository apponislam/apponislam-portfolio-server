import express from "express";
import { messageController } from "./message.controller";

const router = express.Router();

router.post("/", messageController.postMessage);
router.get("/", messageController.getAllMessages);

export const messageRoute = router;
