import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Pre-configured default seed templates for fallback & database seeding
export const SEED_TEMPLATES = [
  {
    name: 'My Tasks | Trello',
    slug: 'my-tasks-trello',
    description: 'Organize your daily tasks, priority items, and personal workflow.',
    category: 'Personal & Productivity',
    coverColor: 'from-amber-600 via-orange-600 to-red-600',
    coverImage: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80',
    lists: [
      {
        name: 'To Do 📋',
        position: 1000,
        cards: [
          { title: 'Review quarterly goals', description: 'Align with team priorities and deliverables.', position: 1000 },
          { title: 'Update project documentation', description: 'Ensure API specs and readme files are current.', position: 2000 }
        ]
      },
      {
        name: 'In Progress 🚀',
        position: 2000,
        cards: [
          { title: 'Build Board Template system', description: 'Implement fullstack cloning engine with Prisma transactions.', position: 1000 }
        ]
      },
      {
        name: 'Done ✅',
        position: 3000,
        cards: [
          { title: 'Initial setup & environment config', description: 'Monorepo setup with Next.js and Express.', position: 1000 }
        ]
      }
    ]
  },
  {
    name: 'New Hire Onboarding',
    slug: 'new-hire-onboarding',
    description: 'Streamline the onboarding journey for new team members from Day 1 to Month 1.',
    category: 'HR & Operations',
    coverColor: 'from-emerald-700 via-teal-700 to-cyan-800',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    lists: [
      {
        name: 'Before Day 1 🎒',
        position: 1000,
        cards: [
          { title: 'Setup work email & hardware', description: 'Order laptop, setup credentials.', position: 1000 },
          { title: 'Send welcome packet', description: 'Share team handbook and expectations.', position: 2000 }
        ]
      },
      {
        name: 'First Day 👋',
        position: 2000,
        cards: [
          { title: 'Team intro coffee chat', description: 'Meet your mentor and immediate team.', position: 1000 },
          { title: 'Development environment setup', description: 'Clone repo, setup local env keys.', position: 2000 }
        ]
      },
      {
        name: 'First Week 🚀',
        position: 3000,
        cards: [
          { title: 'Submit first pull request', description: 'Complete starter ticket and request code review.', position: 1000 }
        ]
      }
    ]
  },
  {
    name: 'Tier List',
    slug: 'tier-list',
    description: 'Rank features, tech stack dependencies, or project ideas into tiers.',
    category: 'Engineering & Product',
    coverColor: 'from-slate-800 via-zinc-900 to-black',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    lists: [
      {
        name: 'S Tier 🔥',
        position: 1000,
        cards: [
          { title: 'TypeScript & React 19', description: 'Strict typing and component clarity.', position: 1000 },
          { title: 'Prisma ORM', description: 'Type-safe database layer.', position: 2000 }
        ]
      },
      {
        name: 'A Tier ⭐️',
        position: 2000,
        cards: [
          { title: 'Tailwind CSS', description: 'Utility-first modern styling.', position: 1000 }
        ]
      },
      {
        name: 'B Tier 👍',
        position: 3000,
        cards: [
          { title: 'REST Endpoints', description: 'Predictable Express routes.', position: 1000 }
        ]
      }
    ]
  },
  {
    name: 'Innovation Weeks',
    slug: 'innovation-weeks',
    description: 'Manage hackathons, R&D projects, and feature prototyping sprints.',
    category: 'Project Management',
    coverColor: 'from-amber-500 via-purple-700 to-indigo-900',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    lists: [
      {
        name: 'Ideas 💡',
        position: 1000,
        cards: [
          { title: 'AI Assistant Integration', description: 'Automate card tagging with AI.', position: 1000 }
        ]
      },
      {
        name: 'Prototyping 🛠️',
        position: 2000,
        cards: [
          { title: 'Real-time WebSocket sync', description: 'Live cursor and card movement updates.', position: 1000 }
        ]
      },
      {
        name: 'Pitch Ready 🎤',
        position: 3000,
        cards: [
          { title: 'Demo Video Recording', description: 'Prepare 2-minute walkthrough video.', position: 1000 }
        ]
      }
    ]
  }
];

// Helper to seed templates if db has none
async function ensureTemplatesSeeded(userId?: bigint) {
  const existingCount = await prisma.board.count({
    where: { isTemplate: true }
  });

  if (existingCount === 0) {
    let creatorId = userId;
    if (!creatorId) {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        creatorId = firstUser.id;
      } else {
        const newUser = await prisma.user.create({
          data: {
            email: 'system@flowboard.app',
            name: 'Flowboard System',
            username: 'system'
          }
        });
        creatorId = newUser.id;
      }
    }

    for (const tpl of SEED_TEMPLATES) {
      await prisma.board.create({
        data: {
          name: tpl.name,
          slug: tpl.slug,
          description: tpl.description,
          category: tpl.category,
          coverColor: tpl.coverColor,
          coverImage: tpl.coverImage,
          isTemplate: true,
          visibility: 'public',
          createdById: creatorId,
          lists: {
            create: tpl.lists.map((l) => ({
              name: l.name,
              position: l.position,
              cards: {
                create: l.cards.map((c) => ({
                  title: c.title,
                  description: c.description,
                  position: c.position,
                  createdById: creatorId
                }))
              }
            }))
          }
        }
      });
    }
  }
}

// Controller: Get Templates
export const getTemplates = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;
    const userIdStr = res.locals?.user?.id;
    const userId = userIdStr ? BigInt(userIdStr) : undefined;

    await ensureTemplatesSeeded(userId);

    const whereCondition: any = {
      isTemplate: true
    };

    if (category && category !== 'all' && category !== 'choose a category') {
      whereCondition.category = {
        contains: String(category),
        mode: 'insensitive'
      };
    }

    if (search) {
      whereCondition.OR = [
        { name: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } }
      ];
    }

    const templates = await prisma.board.findMany({
      where: whereCondition,
      include: {
        lists: {
          orderBy: { position: 'asc' },
          include: {
            cards: {
              orderBy: { position: 'asc' }
            }
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json({ success: true, data: templates });
  } catch (error) {
    console.error('Error in getTemplates:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch templates' });
  }
};

// Controller: Get User Boards
export const getBoards = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, sort } = req.query;

    const whereCondition: any = {
      isTemplate: false
    };

    if (search) {
      whereCondition.name = {
        contains: String(search),
        mode: 'insensitive'
      };
    }

    let orderBy: any = { updatedAt: 'desc' };

    if (sort === 'name') {
      orderBy = { name: 'asc' };
    } else if (sort === 'created') {
      orderBy = { createdAt: 'desc' };
    }

    const boards = await prisma.board.findMany({
      where: whereCondition,
      include: {
        lists: {
          select: { id: true }
        }
      },
      orderBy
    });

    res.json({ success: true, data: boards });
  } catch (error) {
    console.error('Error in getBoards:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch boards' });
  }
};

// Controller: Get Single Board Details
export const getBoardById = async (req: Request, res: Response): Promise<void> => {
  try {
    const idParam = req.params.id as string;
    const boardId = BigInt(idParam);

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        lists: {
          orderBy: { position: 'asc' },
          include: {
            cards: {
              orderBy: { position: 'asc' }
            }
          }
        }
      }
    });

    if (!board) {
      res.status(404).json({ success: false, message: 'Board not found' });
      return;
    }

    res.json({ success: true, data: board });
  } catch (error) {
    console.error('Error in getBoardById:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch board details' });
  }
};

// Controller: Apply Template (Atomically create board + lists + cards from template)
export const applyTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { templateId, name, workspaceId } = req.body;

    if (!templateId || !name) {
      res.status(400).json({ success: false, message: 'Template ID and Board Name are required' });
      return;
    }

    const tplId = BigInt(templateId);

    const templateBoard = await prisma.board.findUnique({
      where: { id: tplId },
      include: {
        lists: {
          orderBy: { position: 'asc' },
          include: {
            cards: {
              orderBy: { position: 'asc' }
            }
          }
        }
      }
    });

    if (!templateBoard) {
      res.status(404).json({ success: false, message: 'Template board not found' });
      return;
    }

    let creatorId: bigint;
    const sessionUserIdStr = res.locals?.user?.id;
    if (sessionUserIdStr) {
      creatorId = BigInt(sessionUserIdStr);
    } else {
      const existingUser = await prisma.user.findFirst();
      if (existingUser) {
        creatorId = existingUser.id;
      } else {
        const newUser = await prisma.user.create({
          data: {
            email: 'default@flowboard.app',
            name: 'Flowboard User',
            username: 'flowboard_user'
          }
        });
        creatorId = newUser.id;
      }
    }

    let targetWorkspaceId: bigint | null = workspaceId ? BigInt(workspaceId) : null;
    if (!targetWorkspaceId) {
      const defaultWorkspace = await prisma.workspace.findFirst();
      if (defaultWorkspace) {
        targetWorkspaceId = defaultWorkspace.id;
      }
    }

    const newBoard = await prisma.$transaction(async (tx) => {
      const createdBoard = await tx.board.create({
        data: {
          name: name.trim(),
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: `Cloned from template: ${templateBoard.name}`,
          visibility: 'workspace',
          isTemplate: false,
          category: templateBoard.category,
          coverColor: templateBoard.coverColor,
          coverImage: templateBoard.coverImage,
          createdById: creatorId,
          workspaceId: targetWorkspaceId
        }
      });

      for (const list of templateBoard.lists) {
        await tx.list.create({
          data: {
            boardId: createdBoard.id,
            name: list.name,
            position: list.position,
            cards: {
              create: list.cards.map((card) => ({
                title: card.title,
                description: card.description,
                position: card.position,
                createdById: creatorId
              }))
            }
          }
        });
      }

      await tx.board.update({
        where: { id: tplId },
        data: { usedCount: { increment: 1 } }
      });

      return createdBoard;
    });

    res.status(201).json({
      success: true,
      message: 'Board created successfully from template!',
      data: newBoard
    });
  } catch (error) {
    console.error('Error in applyTemplate:', error);
    res.status(500).json({ success: false, message: 'Failed to apply template' });
  }
};

// Controller: Create Standard Board
export const createBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, coverColor, coverImage, workspaceId } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: 'Board name is required' });
      return;
    }

    let creatorId: bigint;
    const sessionUserIdStr = res.locals?.user?.id;
    if (sessionUserIdStr) {
      creatorId = BigInt(sessionUserIdStr);
    } else {
      const existingUser = await prisma.user.findFirst();
      if (existingUser) {
        creatorId = existingUser.id;
      } else {
        const newUser = await prisma.user.create({
          data: { email: 'default@flowboard.app', name: 'User', username: 'user' }
        });
        creatorId = newUser.id;
      }
    }

    let targetWorkspaceId: bigint | null = workspaceId ? BigInt(workspaceId) : null;
    if (!targetWorkspaceId) {
      const defaultWorkspace = await prisma.workspace.findFirst();
      if (defaultWorkspace) {
        targetWorkspaceId = defaultWorkspace.id;
      }
    }

    const board = await prisma.board.create({
      data: {
        name: name.trim(),
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: description || null,
        visibility: 'workspace',
        isTemplate: false,
        coverColor: coverColor || 'from-purple-600 to-indigo-700',
        coverImage: coverImage || null,
        createdById: creatorId,
        workspaceId: targetWorkspaceId,
        lists: {
          create: [
            { name: 'To Do 📋', position: 1000 },
            { name: 'In Progress 🚀', position: 2000 },
            { name: 'Done ✅', position: 3000 }
          ]
        }
      }
    });

    res.status(201).json({ success: true, data: board });
  } catch (error) {
    console.error('Error in createBoard:', error);
    res.status(500).json({ success: false, message: 'Failed to create board' });
  }
};

// Controller: Create List
export const createList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { boardId } = req.params;
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ success: false, message: 'List name is required' });
      return;
    }

    const bId = BigInt(boardId as string);

    const lastList = await prisma.list.findFirst({
      where: { boardId: bId },
      orderBy: { position: 'desc' }
    });

    const nextPosition = lastList ? Number(lastList.position) + 1000 : 1000;

    const list = await prisma.list.create({
      data: {
        boardId: bId,
        name: name.trim(),
        position: nextPosition
      }
    });

    res.status(201).json({ success: true, data: list });
  } catch (error) {
    console.error('Error in createList:', error);
    res.status(500).json({ success: false, message: 'Failed to create list' });
  }
};

// Controller: Create Card
export const createCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { listId } = req.params;
    const { title, description } = req.body;

    if (!title) {
      res.status(400).json({ success: false, message: 'Card title is required' });
      return;
    }

    const lId = BigInt(listId as string);

    let creatorId: bigint;
    const sessionUserIdStr = res.locals?.user?.id;
    if (sessionUserIdStr) {
      creatorId = BigInt(sessionUserIdStr);
    } else {
      const existingUser = await prisma.user.findFirst();
      if (existingUser) {
        creatorId = existingUser.id;
      } else {
        const newUser = await prisma.user.create({
          data: { email: 'default@flowboard.app', name: 'User', username: 'user' }
        });
        creatorId = newUser.id;
      }
    }

    const lastCard = await prisma.card.findFirst({
      where: { listId: lId },
      orderBy: { position: 'desc' }
    });

    const nextPosition = lastCard ? Number(lastCard.position) + 1000 : 1000;

    const card = await prisma.card.create({
      data: {
        listId: lId,
        title: title.trim(),
        description: description || null,
        position: nextPosition,
        createdById: creatorId
      }
    });

    res.status(201).json({ success: true, data: card });
  } catch (error) {
    console.error('Error in createCard:', error);
    res.status(500).json({ success: false, message: 'Failed to create card' });
  }
};
