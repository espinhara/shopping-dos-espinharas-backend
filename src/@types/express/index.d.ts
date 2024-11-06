import express, { Request } from 'express';
import jwt from 'jsonwebtoken';
declare global {
  namespace Express {
    interface Request {
      user?: string | jwt.JwtPayload; // Dependendo do que você armazena no `user`
    }
  }
}
