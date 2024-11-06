// src/routes/auth.ts
import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import id6 from '../helpers/id';

const router = express.Router();

// Registro de novo usuário
router.post('/register', async (req: Request, res: Response): Promise<void | any> => {
  try {
    const { name, email, password } = req.body;

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Usuário já registrado' });

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Cria novo usuário
    const newUser = new User({ _id: id6(), name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// Login do usuário
router.post('/login', async (req: Request, res: Response): Promise<void | any> => {
  try {
    const { email, password } = req.body;

    // Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Credenciais inválidas' });

    // Verifica se a senha está correta
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciais inválidas' });

    // Gera o token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET ?? '', { expiresIn: '1h' });
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

export default router;
