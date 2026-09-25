import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new workspace
export const createWorkspace = async (req: Request, res: Response) => {
    try {
        // auth.middleware vazhi varunna user-ne edukkunnu
        const user = res.locals.user;
        const { name } = req.body;

        if (!name) {
            res.status(400).json({ message: "Workspace name is required" });
            return;
        }

        // Trello pole URL-il varan vendi oru 'slug' undakkunnu (eg: my-workspace-1234)
        const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

        // Database-il puthiya workspace undakkunnu, koode aaranu create cheythathu pulliye 'owner' aayi add cheyyunnu
        const workspace = await prisma.workspace.create({
            data: {
                name,
                slug,
                ownerId: user.id,
                members: {
                    create: {
                        userId: user.id,
                        role: 'owner'
                    }
                }
            }
        });

        res.status(201).json(workspace);
    } catch (error) {
        console.error("Create Workspace Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all workspaces for the logged in user
export const getUserWorkspaces = async (req: Request, res: Response) => {
    try {
        const user = res.locals.user;

        // Login cheytha aal member aayittulla ella workspaces-um database-il ninnu edukkunnu
        const workspaces = await prisma.workspace.findMany({
            where: {
                members: {
                    some: {
                        userId: user.id
                    }
                }
            },
            include: {
                members: true
            }
        });

        res.status(200).json(workspaces);
    } catch (error) {
        console.error("Get Workspaces Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
