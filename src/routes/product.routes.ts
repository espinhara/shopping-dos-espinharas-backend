import express, { Request, Response } from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct, list, getPaginatedProducts } from '../controllers/product.controller';
import upload from '../middleware/multer';
import authMiddleware from '../middleware/authMiddleware';
const router = express.Router();


// Rotas de produtos
router.post('/', authMiddleware('admin'), upload.array('images', 4), createProduct);  // Aceitar até 4 imagens
/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista todos os produtos
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                  isActive: 
 *                    type: Boolean
 *                    example: true
 *                  name:
 *                    type: string
 *                    example: Description
 *                  description:
 *                    type:  string
 *                    example: Description
 *                  price:
 *                    type: number
 *                    example: 1
 *                  quantity:
 *                    type: number
 *                    example: 1
 *                  imagesUrls:
 *                    type: array
 *                    items:
 *                      type: string
 *                      example: https://image.png
 */
router.get('/', getProducts);
/**
 * @swagger
 * /products/list:
 *   get:
 *     summary: Lista todos os produtos para o perfil Admin
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                  isActive: 
 *                    type: Boolean
 *                    example: true
 *                  name:
 *                    type: string
 *                    example: Description
 *                  description:
 *                    type:  string
 *                    example: Description
 *                  price:
 *                    type: number
 *                    example: 1
 *                  quantity:
 *                    type: number
 *                    example: 1
 *                  imagesUrls:
 *                    type: array
 *                    items:
 *                      type: string
 *                      example: https://image.png
 */
router.get('/list', authMiddleware('admin'), list);
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

router.get('/search', getPaginatedProducts)
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
 *     description: Retorna os detalhes de um produto específico com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto a ser buscado.
 *     responses:
 *       200:
 *         description: Detalhes do produto encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 60b6c8e5f1c5a2d7e9d0a74b
 *                 name:
 *                   type: string
 *                   example: Camiseta de algodão
 *                 description:
 *                   type: string
 *                   example: Camiseta confortável de algodão 100%.
 *                 price:
 *                   type: number
 *                   example: 49.99
 *                 isActive:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Produto não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produto não encontrado
 *       400:
 *         description: Erro ao buscar o produto.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao obter produto
 *                 error:
 *                   type: object
 */
router.get('/:id', getProductById);
router.put('/:id', authMiddleware('admin'), upload.array('images', 4), updateProduct);  // Aceitar até 4 imagens
router.delete('/:id', authMiddleware('admin'), deleteProduct);

export default router;
