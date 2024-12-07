import express, { Request, Response } from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct, list, getPaginatedProducts } from '../controllers/product.controller';
import upload from '../middleware/multer';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();


// Rotas de produtos
router.post('/', authMiddleware('admin'), upload.array('images', 4), createProduct);  // Aceitar até 4 imagens
router.get('/', getProducts);
router.get('/list', authMiddleware('admin'), list);
router.get('/search', getPaginatedProducts)
router.get('/:id', getProductById);
router.put('/:id', authMiddleware('admin'), upload.array('images', 4), updateProduct);  // Aceitar até 4 imagens
router.delete('/:id', authMiddleware('admin'), deleteProduct);

export default router;
