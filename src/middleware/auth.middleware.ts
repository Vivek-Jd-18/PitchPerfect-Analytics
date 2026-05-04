import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_override_in_production';

interface DecodedToken {
  id: string;
  email: string;
  role: string;
}

export const protectAdminRoute = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Requires ADMIN role' });
    }

    // Attach user payload to request for downstream use
    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Not authorized, token failed or expired' });
  }
};
