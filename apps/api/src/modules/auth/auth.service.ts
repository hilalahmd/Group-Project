import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-dev'; // Nammal pinne ithu .env file-ilekku maattum

// 1. Register Logic
export const registerUser = async (email: string, username: string, passwordPlain: string, displayName: string) => {
  // Aadyam password hash cheyyuka (PDF-il paranja pole cost 12 aanu)
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(passwordPlain, saltRounds);

  // Database-il puthiya user-ne save cheyyuka
  const newUser = await prisma.user.create({
    data: {
      email,
      username,
      displayName,
      passwordHash,
    },
  });

  return newUser;
};

// 2. Login Logic
export const loginUser = async (email: string, passwordPlain: string) => {
  // Aadyam user database-il undenno ennu nokkuka
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user || !user.passwordHash) {
    throw new Error('Invalid email or password');
  }

  // Password check cheyyuka (namukku vanna password-um database-le hashed password-um)
  const isPasswordValid = await bcrypt.compare(passwordPlain, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Success aanenkil JWT Token undakkuka (15 minutes expiry, PDF-il paranjathu pole)
  const token = jwt.sign(
    { userId: user.id.toString() }, // BigInt aaya kondu string aakkanam
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  return { user, token };
};
