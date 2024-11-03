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
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.list = exports.getProducts = exports.createProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const id6_1 = __importDefault(require("../helpers/id6"));
// Criar um novo produto
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, quantity } = req.body;
        const imageUrls = [];
        if (req.files) {
            for (const file of req.files) {
                const result = yield cloudinary_1.default.uploader.upload(file.path, {
                    folder: 'products', // Pasta no Cloudinary onde as imagens serão armazenadas
                }).catch((error) => {
                    console.log(error);
                    return null;
                });
                if (result)
                    imageUrls.push(result.secure_url); // Guardar a URL segura da imagem
            }
        }
        if (imageUrls.length > 4) {
            res.status(400).json({ message: 'Você pode fazer upload de até 4 imagens' });
            return;
        }
        const product = new Product_1.default({ _id: (0, id6_1.default)(), name, description, price, quantity, imageUrls });
        yield product.save();
        res.status(201).json(product);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Erro ao criar produto', error });
    }
});
exports.createProduct = createProduct;
// Obter todos os produtos
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find({ isActive: true });
        res.status(200).json(products);
    }
    catch (error) {
        res.status(400).json({ message: 'Erro ao obter produtos', error });
    }
});
exports.getProducts = getProducts;
// Listar todos os produtos
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(400).json({ message: 'Erro ao obter produtos', error });
    }
});
exports.list = list;
// Obter um único produto por ID
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Product_1.default.findById(req.params.id);
        if (!product) {
            res.status(404).json({ message: 'Produto não encontrado' });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(400).json({ message: 'Erro ao obter produto', error });
    }
});
exports.getProductById = getProductById;
// Atualizar um produto, incluindo até 4 imagens
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, quantity, isActive } = req.body;
        let imageUrls = req.body.imageUrls || [];
        if (req.files) {
            const newImageUrls = [];
            for (const file of req.files) {
                const result = yield cloudinary_1.default.uploader.upload(file.path, {
                    folder: 'products',
                }).catch((error) => {
                    console.log(error);
                    return null;
                });
                if (result)
                    newImageUrls.push(result.secure_url);
            }
            imageUrls = [...imageUrls, ...newImageUrls].slice(0, 4); // Garantir no máximo 4 imagens
        }
        const product = yield Product_1.default.findByIdAndUpdate(req.params.id, { name, description, price, quantity, imageUrls, isActive }, { new: true });
        if (!product) {
            res.status(404).json({ message: 'Produto não encontrado' });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar produto', error });
    }
});
exports.updateProduct = updateProduct;
// Excluir um produto
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Product_1.default.findByIdAndDelete(req.params.id);
        if (!product) {
            res.status(404).json({ message: 'Produto não encontrado' });
            return;
        }
        res.status(200).json({ message: 'Produto excluído com sucesso' });
    }
    catch (error) {
        res.status(400).json({ message: 'Erro ao excluir produto', error });
    }
});
exports.deleteProduct = deleteProduct;
