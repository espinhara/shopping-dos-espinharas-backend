import express, { Request } from 'express';
import jwt from 'jsonwebtoken';
declare global {
  namespace Express {
    interface Request {
      user?: string | {
        id: string;
        name: string;
        email: string;
        type: string;
      } | jwt.JwtPayload; // Dependendo do que você armazena no `user`
    }
  }
}
