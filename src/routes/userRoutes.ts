// routes/sales.js
import express from 'express';
import { list, update } from '../controllers/user.controller';
import authMiddleware from '../middleware/authMiddleware';
const router = express.Router();

// router.post('/', authMiddleware, create);  // Criando a compra
// router.patch('/:id/approve', authMiddleware, approve)
router.get('/list', authMiddleware('admin'), list)
router.put('/:id', update)

export default router