"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const multer_1 = __importDefault(require("../middleware/multer"));
const router = express_1.default.Router();
// Rotas de produtos
router.post('/', multer_1.default.array('images', 4), productController_1.createProduct); // Aceitar até 4 imagens
router.get('/', productController_1.getProducts);
router.get('/list/', productController_1.list);
router.get('/:id', productController_1.getProductById);
router.put('/:id', multer_1.default.array('images', 4), productController_1.updateProduct); // Aceitar até 4 imagens
router.delete('/:id', productController_1.deleteProduct);
exports.default = router;
