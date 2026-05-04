import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';

// A strict implementation would use a proper password hashing library like bcrypt.
// We mock verifyPassword here for the boilerplate.
const verifyPassword = async (plain: string, hashed: string): Promise<boolean> => {
  // TODO: Replace with bcrypt.compare(plain, hashed)
  return plain === hashed; 
};

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_override_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(401).json({ error: 'Invalid credentials or unauthorized role' });
    }

    if (!user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await verifyPassword(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      message: 'Admin login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
};

export const googleAuthCallback = async (req: Request, res: Response) => {
  try {
    // req.user is populated by Passport Google Strategy
    const user = req.user as { id: string; email: string; role: string };

    if (!user) {
      return res.status(401).json({ error: 'Google authentication failed' });
    }

    // Generate JWT for FAN user upon successful Google OAuth
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // In a real application, you might redirect to a frontend with the token, 
    // or set it in a secure HTTP-only cookie.
    return res.status(200).json({
      message: 'Google login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Google auth callback error:', error);
    return res.status(500).json({ error: 'Internal server error during auth callback' });
  }
};
