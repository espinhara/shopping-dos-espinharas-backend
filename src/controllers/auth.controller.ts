import User from "../models/User";
import { Request, Response } from 'express';
import id6 from '../helpers/id';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response): Promise<void | any> => {
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
}

export const login = async (req: Request, res: Response): Promise<void | any> => {
  try {
    const { email, password } = req.body;

    // Verifica se o usuário existe
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).json({ message: 'Credenciais inválidas' });

    // Verifica se a senha está correta
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciais inválidas' });
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      type: user.userType,
      expires: Date.now()
    }
    // Gera o token JWT
    const token = jwt.sign(userData, process.env.JWT_SECRET ?? '', { expiresIn: '1d' });
    res.set('Cache-Control', 'no-store');
    res.status(200).json({ token, user, status: 200, message: "Login bem-sucedido!" });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
}