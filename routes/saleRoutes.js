// routes/sales.js
const express = require('express');
const router = express.Router();
const { create, approve, list } = require('../controllers/saleController');

router.post('/', create);  // Criando a compra
router.patch('/:id/approve', approve)
router.get('/list', list)

module.exports = router