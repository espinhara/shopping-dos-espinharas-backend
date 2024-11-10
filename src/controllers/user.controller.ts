import User from "../models/User";
import { Request, Response } from 'express';

// Listar todos os usuários
export const list = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await User.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao obter usuários', error });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, userType, isActive } = req.body;
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { name, email, userType, isActive }
    ).exec()
    if (!user) {
      res.status(400).json({ message: "Usuário não encontrado" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atulizar usuários', error });
  }
}