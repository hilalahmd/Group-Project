import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware.js";
import { createBoard, getWorkspaceBoards, getBoardById } from "./boards.controller.js";

const router = Router();

// Routes
router.post("/", requireAuth, createBoard);
router.get("/workspace/:workspaceId", requireAuth, getWorkspaceBoards);
router.get("/:id", requireAuth, getBoardById);

export default router;
