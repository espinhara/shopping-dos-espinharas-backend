"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.approve = exports.create = void 0;
const Sale_1 = __importDefault(require("../models/Sale"));
const Product_1 = __importDefault(require("../models/Product"));
const id6_1 = __importDefault(require("../helpers/id6"));
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { products, total, pickupName, customerName, installments, subtotal, status, paymentMethod } = req.body;
        if (!products) {
            res.status(404).json({ message: 'Produto não encontrado' });
            return;
        }
        for (const item of products) {
            const product = yield Product_1.default.findById(item.productId).exec();
            if (!product) {
                res.status(404).json({ error: 'Produto não encontrado' });
                return;
            }
            if (product.quantity < item.quantity) {
                res.status(400).json({ error: 'Quantidade insuficiente em estoque' });
                return;
            }
        }
        // Criar uma nova venda com status "pending"
        const sale = new Sale_1.default({
            _id: (0, id6_1.default)(),
            date: Date.now(),
            products,
            subtotal,
            total,
            paymentMethod,
            installments,
            customerName,
            pickupName,
            status
        });
        yield sale.save();
        res.status(201).json({ message: 'Venda criada com sucesso', sale, status: 201 });
    }
    catch (error) {
        console.error('Erro ao criar venda:', error);
        res.status(500).json({ error: 'Erro ao criar venda' });
    }
});
exports.create = create;
const approve = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: saleId } = req.params;
    try {
        // Encontrar a venda
        const sale = yield Sale_1.default.findById(saleId).exec();
        if (!sale) {
            res.status(404).json({ error: 'Venda não encontrada' });
            return;
        }
        if (sale.status === 'paid') {
            res.status(400).json({ error: 'Venda já foi paga' });
            return;
        }
        // Atualizar o estoque do produto
        for (const item of sale.products) {
            const product = yield Product_1.default.findById(item.productId).exec();
            if (!product) {
                res.status(404).json({ error: 'Produto não encontrado' });
                return;
            }
            if (product.quantity < item.quantity) {
                res.status(400).json({ error: 'Estoque insuficiente para completar a venda' });
                return;
            }
            product.quantity -= item.quantity;
            yield product.save();
        }
        // Atualizar o status da venda para "paid"
        sale.status = 'paid';
        yield sale.save();
        res.json({ message: 'Venda marcada como paga e estoque atualizado', sale, });
    }
    catch (error) {
        console.error('Erro ao processar pagamento da venda:', error);
        res.status(500).json({ error: 'Erro ao processar pagamento da venda' });
    }
});
exports.approve = approve;
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sales = yield Sale_1.default.find().exec();
    res.status(200).json(sales);
});
exports.list = list;
