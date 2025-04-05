import express from 'express';
import { getPaginatedProducts } from "../../controllers/product.controller";
const router = express.Router();
/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Lista produtos paginados
 *     description: Retorna uma lista de produtos com paginação e busca opcional por nome ou descrição.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página atual.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Número de itens por página.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Texto para busca no nome ou descrição dos produtos.
 *     responses:
 *       200:
 *         description: Retorna os produtos paginados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 totalItems:
 *                   type: integer
 *                   example: 100
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 60b6c8e5f1c5a2d7e9d0a74b
 *                       name:
 *                         type: string
 *                         example: Camiseta de algodão
 *                       description:
 *                         type: string
 *                         example: Camiseta confortável de algodão 100%.
 *                       price:
 *                         type: number
 *                         example: 49.99
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/search', getPaginatedProducts);

export default router;