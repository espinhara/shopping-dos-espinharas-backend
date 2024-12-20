import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes';
import saleRoutes from './routes/sale.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

// Inicialização do app
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Pasta para servir imagens

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
