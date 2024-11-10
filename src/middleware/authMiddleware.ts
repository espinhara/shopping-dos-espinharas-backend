// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (requiredUserType: string) => {

  return (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET ?? '') as {
        id: string;
        name: string;
        email: string;
        type: string;
      };
      req.user = decoded; // Você pode adicionar um tipo para req.user se desejar
      if (requiredUserType && req.user?.type !== requiredUserType)
        res.status(401).json({ message: "Acesso negado. Tente mais tarde." })
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token inválido' });
    }
  }
};

export default authMiddleware;
