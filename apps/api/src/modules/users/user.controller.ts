import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth/auth.config.js";

const prisma = new PrismaClient();

/**
 * GET /api/users/profile
 * Returns authenticated user's profile (safe fields only)
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized - Please log in" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: BigInt(userId) },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        displayName: true,
        emailVerified: true,
        avatarUrl: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User profile not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * PUT /api/users/profile
 * Updates authenticated user's name and/or email
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized - Please log in" });
      return;
    }

    const { name, email } = req.body;
    const updateData: { name?: string; email?: string } = {};

    // Validate Name
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim() === "") {
        res.status(400).json({ message: "Name cannot be empty" });
        return;
      }
      updateData.name = name.trim();
    }

    // Validate Email
    if (email !== undefined) {
      if (typeof email !== "string" || email.trim() === "") {
        res.status(400).json({ message: "Email cannot be empty" });
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const trimmedEmail = email.trim().toLowerCase();

      if (!emailRegex.test(trimmedEmail)) {
        res.status(400).json({ message: "Please provide a valid email address" });
        return;
      }

      // Check if email is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          email: trimmedEmail,
          NOT: { id: BigInt(userId) },
        },
      });

      if (existingUser) {
        res.status(409).json({ message: "This email address is already in use by another account" });
        return;
      }

      updateData.email = trimmedEmail;
    }

    if (Object.keys(updateData).length === 0) {
      res.status(400).json({ message: "No fields provided to update" });
      return;
    }

    // Update in Prisma User table
    const updatedUser = await prisma.user.update({
      where: { id: BigInt(userId) },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        displayName: true,
        emailVerified: true,
        avatarUrl: true,
        image: true,
        createdAt: true,
      },
    });

    // Also sync update with better-auth session user
    try {
      await auth.api.updateUser({
        body: updateData,
        headers: fromNodeHeaders(req.headers),
      });
    } catch (authError) {
      console.warn("better-auth updateUser sync notice:", authError);
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * PUT /api/users/profile/password
 * Changes authenticated user's password securely
 */
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized - Please log in" });
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || typeof currentPassword !== "string") {
      res.status(400).json({ message: "Current password is required" });
      return;
    }

    if (!newPassword || typeof newPassword !== "string") {
      res.status(400).json({ message: "New password is required" });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ message: "New password must be at least 8 characters long" });
      return;
    }

    if (!confirmPassword || typeof confirmPassword !== "string") {
      res.status(400).json({ message: "Please confirm your new password" });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({ message: "New password and confirmation password do not match" });
      return;
    }

    // 1. Attempt password change using better-auth auth.api.changePassword
    try {
      await auth.api.changePassword({
        body: {
          currentPassword,
          newPassword,
          revokeOtherSessions: false,
        },
        headers: fromNodeHeaders(req.headers),
      });

      // 2. Also hash and sync passwordHash on User model with bcrypt if present
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: BigInt(userId) },
        data: { passwordHash: hashedPassword },
      });

      res.status(200).json({ message: "Password updated successfully" });
      return;
    } catch (authErr: any) {
      console.error("Password change auth error:", authErr);
      const msg = authErr?.message || authErr?.statusText || "Incorrect current password or invalid request.";
      res.status(400).json({ message: msg });
      return;
    }
  } catch (error) {
    console.error("Error in changePassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
