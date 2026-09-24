import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware.js";
import { createWorkspace, getUserWorkspaces } from "./workspaces.controller.js";

const router = Router();

// Ee routes access cheyyan user login cheythittundavanam (requireAuth)
router.post("/", requireAuth, createWorkspace);
router.get("/", requireAuth, getUserWorkspaces);

export default router;
