import express from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct, list } from '../controllers/productController';
import upload from '../middleware/multer';

const router = express.Router();

// Rotas de produtos
router.post('/', upload.array('images', 4), createProduct);  // Aceitar até 4 imagens
router.get('/', getProducts);
router.get('/list/', list);
router.get('/:id', getProductById);
router.put('/:id', upload.array('images', 4), updateProduct);  // Aceitar até 4 imagens
router.delete('/:id', deleteProduct);

export default router;
