const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, list } =
  require('../controllers/productController');

const upload = require('../middleware/multer');

// Rotas de produtos
router.post('/', upload.array('images', 4), createProduct);  // Aceitar até 4 imagens
router.get('/', getProducts);
router.get('/list/', list);
router.get('/:id', getProductById);
router.put('/:id', upload.array('images', 4), updateProduct);  // Aceitar até 4 imagens
router.delete('/:id', deleteProduct);

module.exports = router;
