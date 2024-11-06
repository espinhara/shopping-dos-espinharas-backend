// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ message: 'Autorização negada' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '');
    req.user = decoded; // Você pode adicionar um tipo para req.user se desejar
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

export default authMiddleware;
