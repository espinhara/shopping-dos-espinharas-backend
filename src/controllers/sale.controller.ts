import Sale, { ISale } from '../models/Sale'
import Product from '../models/Product'
import id6 from '../helpers/id'
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
}

export const total = async (req: Request, res: Response): Promise<void> => {
  const result = await Sale.aggregate([
    {
      $group: {
        _id: null, // Não agrupa por campo, faz a soma de todas as vendas
        totalSales: { $sum: '$total' },// Soma do campo total
        totalQuantityProducts: { $sum: { $sum: '$products.quantity' } } // Soma de todas as quantidades dentro do array products
      }
    }
  ]);

  // Se o resultado não estiver vazio, retornar o total das vendas

  res.status(200).json({
    totalSales: result[0].totalSales, // O valor da soma
    totalQuantityProducts: result[0].totalQuantityProducts // O valor da soma
  });
}

export const getSalesLastSixMonths = async (req: Request, res: Response): Promise<void> => {
  const today = new Date();
  const lastSixMonths = [];

  // Obtém os primeiros dias dos últimos 6 meses
  for (let i = 0; i < 6; i++) {
    const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
    lastSixMonths.push(monthStart);
  }

  // Define o intervalo de datas (do primeiro dia do mês mais antigo até o último dia deste mês)
  const startOfOldestMonth = lastSixMonths[lastSixMonths.length - 1];
  const endOfToday = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Agrupamento e cálculo
  const sales = await Sale.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startOfOldestMonth, // Primeiro dia do intervalo
          $lte: endOfToday,         // Último dia do intervalo
        },
      },
    },
    {
      $project: {
        month: { $month: '$createdAt' },
        year: { $year: '$createdAt' },
        total: 1,
      },
    },
    {
      $group: {
        _id: { year: '$year', month: '$month' },
        totalSales: { $sum: '$total' },
      },
    },
  ]);

  // Preenche meses sem vendas com 0
  const formattedSales = lastSixMonths.reverse().map((date) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const monthSales = sales.find(
      (s) => s._id.month === month && s._id.year === year
    );

    const formattedMonth = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    return {
      month: formattedMonth.charAt(0).toUpperCase() + formattedMonth.slice(1),
      totalSales: monthSales ? monthSales.totalSales : 0,
    };
  });
  res.json({ lastSixMonths: formattedSales }).status(200);
  return
}

export const getProductsSalesData = async (req: Request, res: Response): Promise<void> => {
  try {
    const productSales = await Sale.aggregate([
      { $unwind: '$products' }, // Expande o array de produtos
      {
        $group: {
          _id: '$products.productId',
          totalQuantity: { $sum: '$products.quantity' }, // Soma as quantidades de cada produto
          productName: { $first: '$products.productName' }, // Nome do produto
          totalRevenue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } }, // Receita total
        },
      },
      { $sort: { totalQuantity: -1 } }, // Ordena pelo total vendido (mais vendidos primeiro)
    ]);

    res.status(200).json(productSales);
  } catch (error) {
    console.error('Error fetching product sales data:', error);
    res.status(500).json({ message: 'Error fetching product sales data' });
  }
}

export const getTopAndLeastSoldProducts = async (req: Request, res: Response) => {
  try {
    const productSales = await Sale.aggregate([
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.productId',
          totalQuantity: { $sum: '$products.quantity' },
          productName: { $first: '$products.productName' },
        },
      },
      { $sort: { totalQuantity: -1 } },
    ]);

    const mostSold = productSales.slice(0, 5); // Top 5 mais vendidos
    const leastSold = productSales.slice(-5); // Top 5 menos vendidos

    res.status(200).json({ mostSold, leastSold });
  } catch (error) {
    console.error('Error fetching product sales data:', error);
    res.status(500).json({ message: 'Error fetching product sales data' });
  }
};
