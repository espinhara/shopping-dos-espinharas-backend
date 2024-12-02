// routes/sales.js
import express from 'express';
import { create, approve, list, total, getSalesLastSixMonths, getProductsSalesData, getTopAndLeastSoldProducts, createFromCart } from '../controllers/sale.controller';
import authMiddleware from '../middleware/authMiddleware';
const router = express.Router();

router.post('/', authMiddleware('client'), create);  // Criando a compra
router.patch('/:id/approve', authMiddleware('admin'), approve)
router.get('/list', authMiddleware('admin'), list)
router.get('/total', authMiddleware('admin'), total)
router.get('/last-six-months', authMiddleware('admin'), getSalesLastSixMonths)
router.get('/products-per-sales', authMiddleware('admin'), getProductsSalesData)
router.get('/top-least-products', authMiddleware('admin'), getTopAndLeastSoldProducts)
router.post('/cart', authMiddleware('client'), createFromCart)

export default router