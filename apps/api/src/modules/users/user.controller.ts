import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth/auth.config.js";

const prisma = new PrismaClient();

/**
 * Helper to determine if a user is a Google OAuth user from their account records
 */
const checkIsGoogleUser = (accounts: { providerId: string }[]): boolean => {
  return accounts.some(
    (acc) => acc.providerId && acc.providerId.toLowerCase() === "google"
  );
};

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
        accounts: {
          select: {
            providerId: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ message: "User profile not found" });
      return;
    }

    const isGoogleUser = checkIsGoogleUser(user.accounts);

    const currentSessionData = res.locals.session
      ? {
          id: res.locals.session.id,
          createdAt: res.locals.session.createdAt,
          expiresAt: res.locals.session.expiresAt,
          userAgent: res.locals.session.userAgent || req.headers["user-agent"] || null,
          ipAddress: res.locals.session.ipAddress || req.ip || null,
        }
      : null;

    const activeSessionsCount = await prisma.session.count({
      where: {
        userId: BigInt(userId),
        expiresAt: { gt: new Date() },
      },
    });

    res.status(200).json({
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        avatarUrl: user.avatarUrl,
        image: user.image,
        createdAt: user.createdAt,
        isGoogleUser,
        accounts: user.accounts,
        currentSession: currentSessionData,
        activeSessionsCount,
      },
    });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * PUT /api/users/profile
 * Updates authenticated user's profile info (name, email, username, displayName)
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized - Please log in" });
      return;
    }

    const { name, email, username, displayName } = req.body;
    const updateData: {
      name?: string;
      email?: string;
      username?: string | null;
      displayName?: string | null;
    } = {};

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

    // Validate Username
    if (username !== undefined) {
      if (username === null || username === "") {
        updateData.username = null;
      } else if (typeof username === "string") {
        const trimmedUsername = username.trim().toLowerCase();
        if (trimmedUsername.length > 0) {
          if (trimmedUsername.length < 3) {
            res.status(400).json({ message: "Username must be at least 3 characters" });
            return;
          }
          if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
            res.status(400).json({ message: "Username can only contain letters, numbers, underscores, and hyphens" });
            return;
          }

          const existingUsername = await prisma.user.findFirst({
            where: {
              username: trimmedUsername,
              NOT: { id: BigInt(userId) },
            },
          });

          if (existingUsername) {
            res.status(409).json({ message: "Username is already taken" });
            return;
          }

          updateData.username = trimmedUsername;
        }
      }
    }

    // Validate Display Name
    if (displayName !== undefined) {
      if (displayName === null || displayName === "") {
        updateData.displayName = null;
      } else if (typeof displayName === "string") {
        updateData.displayName = displayName.trim();
      }
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
        accounts: {
          select: {
            providerId: true,
          },
        },
      },
    });

    const isGoogleUser = checkIsGoogleUser(updatedUser.accounts);

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
      user: {
        id: updatedUser.id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        username: updatedUser.username,
        displayName: updatedUser.displayName,
        emailVerified: updatedUser.emailVerified,
        avatarUrl: updatedUser.avatarUrl,
        image: updatedUser.image,
        createdAt: updatedUser.createdAt,
        isGoogleUser,
        accounts: updatedUser.accounts,
      },
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

    // Security check: ensure user is NOT a Google OAuth user
    const user = await prisma.user.findUnique({
      where: { id: BigInt(userId) },
      select: {
        accounts: {
          select: {
            providerId: true,
          },
        },
      },
    });

    if (user && checkIsGoogleUser(user.accounts)) {
      res.status(400).json({
        message: "Your account is connected with Google. Password management is handled by Google.",
      });
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

/**
 * POST /api/users/logout-all
 * Invalidate all active sessions for the authenticated user
 */
export const logoutAllDevices = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized - Please log in" });
      return;
    }

    // 1. Delete all session records for this user from Prisma Session table
    const deleteResult = await prisma.session.deleteMany({
      where: { userId: BigInt(userId) },
    });

    // 2. Also invoke better-auth API to revoke sessions if available
    try {
      if (typeof (auth.api as any).revokeUserSessions === "function") {
        await (auth.api as any).revokeUserSessions({
          body: { userId: userId.toString() },
          headers: fromNodeHeaders(req.headers),
        });
      } else if (typeof (auth.api as any).signOut === "function") {
        await auth.api.signOut({
          headers: fromNodeHeaders(req.headers),
        });
      }
    } catch (authError) {
      console.warn("better-auth logout-all sync notice:", authError);
    }

    res.status(200).json({
      message: "Successfully logged out from all devices",
      sessionsTerminated: deleteResult.count,
    });
  } catch (error) {
    console.error("Error in logoutAllDevices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
