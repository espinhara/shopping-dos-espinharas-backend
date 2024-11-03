"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/sales.js
const express_1 = __importDefault(require("express"));
const saleController_1 = require("../controllers/saleController");
const router = express_1.default.Router();
router.post('/', saleController_1.create); // Criando a compra
router.patch('/:id/approve', saleController_1.approve);
router.get('/list', saleController_1.list);
exports.default = router;
