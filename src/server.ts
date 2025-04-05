import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/product.routes';
import saleRoutes from './routes/sale.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { setupSwagger } from './config/swagger';
import config from './config';

// Inicialização do app
dotenv.config();
const app = express();

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


setupSwagger(app)
// Iniciar servidor
app.listen(config.port, () => {
  console.log(`Servidor rodando na porta ${config.port}`);
});
