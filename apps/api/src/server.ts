import app from './app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log(' Database connected successfully! (PostgreSQL)');
  } catch (error) {
    console.error(' Database connection error:', error);
  }

  app.listen(PORT, () => {
    console.log(`server is running beutifully on http://localhost:${PORT}`);
  });
}

startServer();