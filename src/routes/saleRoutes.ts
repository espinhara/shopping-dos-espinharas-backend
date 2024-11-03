// routes/sales.js
import express from 'express';
import { create, approve, list } from '../controllers/saleController';
const router = express.Router();

router.post('/', create);  // Criando a compra
router.patch('/:id/approve', approve)
router.get('/list', list)

export default router