// backend/middleware/multer.js
const multer = require('multer');
const path = require('path');

// Configuração do multer para aceitar imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Função de validação do tipo de arquivo (apenas imagens)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.webp') {
    return cb(new Error('Apenas imagens são permitidas'));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
