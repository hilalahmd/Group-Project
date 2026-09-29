import { Router } from "express";
import { requireAuth } from "../auth/auth.middleware.js";
import { getProfile, updateProfile, changePassword, logoutAllDevices } from "./user.controller.js";

const router = Router();

// Protect all user profile endpoints with requireAuth middleware
router.get("/profile", requireAuth, getProfile);
router.put("/profile", requireAuth, updateProfile);
router.put("/profile/password", requireAuth, changePassword);
router.post("/logout-all", requireAuth, logoutAllDevices);

export default router;
