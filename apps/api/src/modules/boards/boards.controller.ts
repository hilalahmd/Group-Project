import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Puthiya board undakkan
export const createBoard = async (req: Request, res: Response) => {
    try {
        const user = res.locals.user;
        console.log("DEBUG: received req.body in createBoard:", req.body);
        const { workspaceId, name, visibility, background } = req.body;

        if (!workspaceId || !name || !visibility) {
            console.log("DEBUG: validation failed. workspaceId:", workspaceId, "name:", name, "visibility:", visibility);
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

// Oru prathyeka board edukkan (with lists and cards)
export const getBoardById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const board = await prisma.board.findUnique({
            where: { id: BigInt(id) },
            include: {
                members: {
                    include: { user: true }
                },
                lists: {
                    where: { archivedAt: null },
                    orderBy: { position: 'asc' },
                    include: {
                        cards: {
                            where: { archivedAt: null },
                            orderBy: { position: 'asc' },
                            include: {
                                members: { include: { user: true } }
                            }
                        }
                    }
                }
            }
        });

        if (!board) {
            res.status(404).json({ message: "Board not found" });
            return;
        }

        res.status(200).json(board);
    } catch (error) {
        console.error("Get Board Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
