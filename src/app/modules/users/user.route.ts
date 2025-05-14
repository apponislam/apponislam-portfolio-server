import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.login);
router.get("/:id", userController.getUserById);

export const userRoute = router;
