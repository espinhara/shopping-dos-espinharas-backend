// src/middleware/multer.ts
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';

// Configuração do multer para aceitar imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Função de validação do tipo de arquivo (apenas imagens)
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    return cb(new Error('Apenas imagens são permitidas'));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;
