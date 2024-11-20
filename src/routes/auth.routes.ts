// src/routes/auth.ts
import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { login, register } from '../controllers/auth.controller';

const router = express.Router();

// Registro de novo usuário
router.post('/register', register);

// Login do usuário
router.post('/login', login);

export default router;
