import { Request, Response } from 'express';
import * as AuthService from './auth.service.js';

// 1. Register User
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password, displayName } = req.body;
    
    // Service-ne vilikkunnu
    const user = await AuthService.registerUser(email, username, password, displayName);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id.toString(), // BigInt aaya kondu string aakkanam
        email: user.email,
        username: user.username
      }
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Server Error' });
  }
};

// 2. Login User
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Service-ne vilikkunnu
    const data = await AuthService.loginUser(email, password);

    res.status(200).json({
      message: 'User logged in successfully',
      user: {
        id: data.user.id.toString(),
        email: data.user.email
      },
      token: data.token
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message || 'Server Error' });
  }
};
