// routes/sales.js
import express from 'express';
import { create, approve, list } from '../controllers/saleController';
import authMiddleware from '../middleware/authMiddleware';
const router = express.Router();

router.post('/', authMiddleware, create);  // Criando a compra
router.patch('/:id/approve', authMiddleware, approve)
router.get('/list', authMiddleware, list)

export default router