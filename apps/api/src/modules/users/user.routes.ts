import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware.js";
import { getProfile, updateProfile, changePassword } from "./user.controller.js";

const router = Router();

// Protect all user profile endpoints with requireAuth middleware
router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, updateProfile);
router.put("/profile/password", requireAuth, changePassword);

export default router;
