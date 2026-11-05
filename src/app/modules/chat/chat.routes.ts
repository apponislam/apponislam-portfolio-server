import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { chatControllers } from "./chat.controllers";
import { chatValidation } from "./chat.validation";

const router = express.Router();

/**
 * Health & Model Status Routes
 */
router.get("/health", chatControllers.checkHealth);
router.get("/status", chatControllers.checkHealth);

/**
 * Guest Session Routes
 */
router.post("/sessions", validateRequest(chatValidation.createSessionSchema), chatControllers.createSession);

router.get("/sessions/:sessionId", chatControllers.getSession);

router.get("/sessions/:sessionId/messages", chatControllers.getSessionMessages);

router.delete("/sessions/:sessionId", chatControllers.deleteSession);

/**
 * Chat Stream Route (SSE)
 */
router.post("/", validateRequest(chatValidation.sendMessageSchema), chatControllers.sendChatMessage);

export const chatRoutes = router;
