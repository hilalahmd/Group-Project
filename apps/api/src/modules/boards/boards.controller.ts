import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Puthiya board undakkan
export const createBoard = async (req: Request, res: Response) => {
    try {
        const user = res.locals.user;
        const { workspaceId, name, visibility, background } = req.body;

        if (!workspaceId || !name || !visibility) {
            res.status(400).json({ message: "WorkspaceId, name, and visibility are required" });
            return;
        }

        const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

        // Database-il board save cheyyunnu (Koode nammal puthiyathayi add cheytha background-um)
        const board = await prisma.board.create({
            data: {
                workspaceId: BigInt(workspaceId),
                name,
                slug,
                visibility,
                background, 
                createdById: user.id,
                members: {
                    create: {
                        userId: user.id,
                        role: 'admin'
                    }
                }
            }
        });

        res.status(201).json(board);
    } catch (error) {
        console.error("Create Board Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Oru workspace-il ulla ella boards-um edukkan
export const getWorkspaceBoards = async (req: Request, res: Response) => {
    try {
        const { workspaceId } = req.params;

        const boards = await prisma.board.findMany({
            where: {
                workspaceId: BigInt(workspaceId),
                archivedAt: null // Delete/Archive cheyyatha boards mathram edukkunnu
            },
            orderBy: {
                updatedAt: 'desc' // Ettavum latest aayi use cheythathu aadyam varan
            }
        });

        res.status(200).json(boards);
    } catch (error) {
        console.error("Get Boards Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
