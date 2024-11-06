import Sale, { ISale } from '../models/Sale'
import Product from '../models/Product'
import id6 from '../helpers/id6'
import { Request, Response } from 'express';

export const create = async (req: Request, res: Response): Promise<void> => {
  const { products, total, pickupName, customerName, installments, subtotal, status, paymentMethod } = req.body;
  try {
    for (const item of products) {
      const product = await Product.findById(item.productId).exec();
      if (!product) {
        res.status(404).json({ error: 'Produto não encontrado' });
        return
      }
      if (product.quantity < item.quantity) {
        res.status(400).json({ error: 'Quantidade insuficiente em estoque' });
        return
      }
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

export const approve = async (req: Request, res: Response): Promise<void> => {
  const { id: saleId } = req.params;

  try {
    // Encontrar a venda
    const sale = await Sale.findById(saleId).exec();
    if (!sale) {
      res.status(404).json({ error: 'Venda não encontrada :/' })
      return
    };
    if (sale.status === 'paid') {
      res.status(400).json({ error: 'Venda já foi paga :/' });
      return
    }
    // Atualizar o estoque do produto
    for (const item of sale.products) {
      const product = await Product.findById(item.productId).exec();
      if (!product) {
        res.status(404).json({ error: 'Item da venda não encontrado :/' });
        return
      }
      if (product.quantity < item.quantity) {
        res.status(400).json({ error: 'Estoque insuficiente para completar a venda' });
        return
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

export const list = async (req: Request, res: Response): Promise<void> => {
  const sales = await Sale.find().exec();
  res.status(200).json(sales);
  return
}