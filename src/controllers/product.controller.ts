import { Request, Response } from 'express';
import Product from '../models/Product';
import cloudinary from '../config/cloudinary';
import id6 from '../helpers/id';

// Criar um novo produto
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, quantity } = req.body;
    const imageUrls: string[] = [];

    if (req.files) {
      for (const file of req.files as Express.Multer.File[]) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'products', // Pasta no Cloudinary onde as imagens serão armazenadas
        }).catch((error) => {
          console.log(error);
          return null;
        });
        if (result) imageUrls.push(result.secure_url); // Guardar a URL segura da imagem
      }
    }

    if (imageUrls.length > 4) {
      res.status(400).json({ message: 'Você pode fazer upload de até 4 imagens' });
      return;
    }

    const product = new Product({ _id: id6(), name, description, price, quantity, imageUrls });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Erro ao criar produto', error });
  }
};

// Obter todos os produtos
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ isActive: true });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao obter produtos', error });
  }
};

// Listar todos os produtos
export const list = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao obter produtos', error });
  }
};

// Obter um único produto por ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Produto não encontrado' });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao obter produto', error });
  }
};

export const getPaginatedProducts = async (req: Request, res: Response) => {
  try {
    // Parâmetros de query para paginação e busca
    const page = parseInt(req.query.page as string) || 1; // Página atual
    const limit = parseInt(req.query.limit as string) || 20; // Itens por página
    const search = (req.query.search as string) || ''; // Texto de busca
    // const isActive = req.query.isActive === 'true'; // Filtro de ativos

    // Monta o filtro de busca
    const query: any = {
      isActive: true,// isActive,
    };

    // Adiciona busca por nome ou descrição se 'search' estiver presente
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Conta o número total de documentos correspondentes ao filtro
    const total = await Product.countDocuments(query);

    // Busca os produtos paginados
    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    // Retorna os resultados paginados e metadados
    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      items: products,
    });
  } catch (error) {
    console.error('Error fetching paginated products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Atualizar um produto, incluindo até 4 imagens
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, quantity, isActive } = req.body;
    let imageUrls: string[] = req.body.imageUrls || [];

    if (req.files) {
      const newImageUrls: string[] = [];
      for (const file of req.files as Express.Multer.File[]) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'products',
        }).catch((error) => {
          console.log(error);
          return null;
        });
        if (result) newImageUrls.push(result.secure_url);
      }
      imageUrls = [...imageUrls, ...newImageUrls].slice(0, 4); // Garantir no máximo 4 imagens
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, quantity, imageUrls, isActive },
      { new: true }
    );
    if (!product) {
      res.status(404).json({ message: 'Produto não encontrado' });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar produto', error });
  }
};

// Excluir um produto
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Produto não encontrado' });
      return;
    }
    res.status(200).json({ message: 'Produto excluído com sucesso' });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao excluir produto', error });
  }
};
