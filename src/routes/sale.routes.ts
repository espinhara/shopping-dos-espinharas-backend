// routes/sales.js
import express from 'express';
import { create, approve, list, total } from '../controllers/sale.controller';
import authMiddleware from '../middleware/authMiddleware';
const router = express.Router();

router.post('/', authMiddleware('client'), create);  // Criando a compra
router.patch('/:id/approve', authMiddleware('admin'), approve)
router.get('/list', authMiddleware('admin'), list)
router.get('/total', authMiddleware('admin'), total)

export default router