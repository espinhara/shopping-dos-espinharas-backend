const Sale = require('../models/Sale');
const Product = require('../models/Product');
const id6 = require('../helpers/id6');

/**
 * @param {{
 * body:{
 * products:[{
 * quantity:number;
 * productId:string;
 * productName:string;
 * price:number;
 * }],
 * total:number;
 * pickupName:string;
 * customerName:string;
 * status:string;
 * subtotal:number;
 * installments: number;
 * paymentMethod:string;
 * }}} req - Request by Client
 * @param {Response} res - Response by Server
 */
exports.create = async (req, res) => {
  const { products, total, pickupName, customerName, installments, subtotal, status, paymentMethod } = req.body;
  try {
    for (const item of products) {
      const product = await Product.findById(item.productId).exec();
      if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
      if (product.quantity < item.quantity) return res.status(400).json({ error: 'Quantidade insuficiente em estoque' });
    }

    // Criar uma nova venda com status "pending"
    const sale = new Sale({
      _id: id6(),
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

    await sale.save();
    res.status(201).json({ message: 'Venda criada com sucesso', sale, status: 201 });

  } catch (error) {
    console.error('Erro ao criar venda:', error);
    res.status(500).json({ error: 'Erro ao criar venda' });
  }
}

exports.approve = async (req, res) => {
  const { id: saleId } = req.params;

  try {
    // Encontrar a venda
    const sale = await Sale.findById(saleId).exec();
    if (!sale) return res.status(404).json({ error: 'Venda não encontrada' });
    if (sale.status === 'paid') return res.status(400).json({ error: 'Venda já foi paga' });

    // Atualizar o estoque do produto
    for (const item of sale.products) {
      const product = await Product.findById(item.productId).exec();
      if (product.quantity < item.quantity) {
        return res.status(400).json({ error: 'Estoque insuficiente para completar a venda' });
      }
      product.quantity -= item.quantity;
      await product.save();

    }


    // Atualizar o status da venda para "paid"
    sale.status = 'paid';
    await sale.save();

    res.json({ message: 'Venda marcada como paga e estoque atualizado', sale, });
  } catch (error) {
    console.error('Erro ao processar pagamento da venda:', error);
    res.status(500).json({ error: 'Erro ao processar pagamento da venda' });
  }
}

exports.list = async (req, res) => {
  const sales = await Sale.find().exec();
  return res.status(200).json(sales);
}