import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create a dummy user
  const user = await prisma.user.upsert({
    where: { email: 'hilal@example.com' },
    update: {},
    create: {
      email: 'hilal@example.com',
      name: 'Hilal Ahmed',
      username: 'hilal',
      emailVerified: true,
      passwordHash: 'dummyhash', // In reality, better-auth handles this
    },
  });

  console.log(`Created user: ${user.name}`);

  // 2. Create a workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corp',
      slug: 'acme-corp',
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          role: 'owner',
        },
      },
    },
  });

  console.log(`Created workspace: ${workspace.name}`);

  // 3. Create a board
  const board = await prisma.board.create({
    data: {
      workspaceId: workspace.id,
      name: 'Product Roadmap',
      slug: 'product-roadmap',
      visibility: 'workspace',
      createdById: user.id,
      members: {
        create: {
          userId: user.id,
          role: 'admin',
        },
      },
    },
  });

  console.log(`Created board: ${board.name}`);

  // 4. Create lists
  const list1 = await prisma.list.create({
    data: {
      boardId: board.id,
      name: 'To Do',
      position: 1000,
    },
  });

  const list2 = await prisma.list.create({
    data: {
      boardId: board.id,
      name: 'In Progress',
      position: 2000,
    },
  });

  const list3 = await prisma.list.create({
    data: {
      boardId: board.id,
      name: 'Done',
      position: 3000,
    },
  });

  console.log('Created lists');

  // 5. Create some cards
  await prisma.card.create({
    data: {
      listId: list1.id,
      createdById: user.id,
      title: 'Design minimal landing page',
      position: 1000,
      description: 'Update the landing page to match the new minimal aesthetic.',
      members: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  await prisma.card.create({
    data: {
      listId: list2.id,
      createdById: user.id,
      title: 'Implement drag and drop',
      position: 1000,
    },
  });

  console.log('Created cards');
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
