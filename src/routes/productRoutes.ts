import express, { Request, Response } from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct, list } from '../controllers/productController';
import upload from '../middleware/multer';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();


// Rotas de produtos
router.post('/', authMiddleware, upload.array('images', 4), createProduct);  // Aceitar até 4 imagens
router.get('/', getProducts);
router.get('/list', authMiddleware, (req: Request, res: Response) => list(req, res));
router.get('/:id', getProductById);
router.put('/:id', authMiddleware, upload.array('images', 4), updateProduct);  // Aceitar até 4 imagens
router.delete('/:id', authMiddleware, deleteProduct);

export default router;
