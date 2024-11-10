// routes/sales.js
import express from 'express';
import { create, approve, list } from '../controllers/sale.controller';
import authMiddleware from '../middleware/authMiddleware';
const router = express.Router();

router.post('/', create);  // Criando a compra
router.patch('/:id/approve', authMiddleware('admin'), approve)
router.get('/list', authMiddleware('admin'), list)

export default router