import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import config from '.';

import cors from 'cors';

// Configuração do Swagger
const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentação da API com Swagger',
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api`, // Altere para o URL da sua API
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Caminho para os arquivos com as definições das rotas
};

// Inicialização do Swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use(cors());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger disponível em: http://localhost:${config.port}/api-docs`);
};
