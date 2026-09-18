import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '0.0.1',
    description: 'Api documentation prepared for Express + TypeScript project',
  },
  servers: [
    {
      url: process.env.RAILWAY_STATIC_URL 
        ? `https://${process.env.RAILWAY_STATIC_URL}/api/v1` 
        : 'http://localhost:3000/api/v1',
      description: 'Əsas API Serveri (Bütün sorğuların başına /api/v1 qoyur)'
    },
  ],
  components: {
    // 👇 BURANI TAMAMİLƏ SƏNİN STANDARTA UYĞUN DƏYİŞDİK
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Bura login olanda gələn accessToken-i birbaşa yapışdır (Başına Bearer yazmağa ehtiyac yoxdur, Swagger özü qoyacaq)',
      }
    },
  },
  // Bütün endpoint-lərdə bu təhlükəsizlik qaydası keçərli olsun
  security: [
    {
      BearerAuth: [],
    }
  ],
};

const options: swaggerJsdoc.Options = {
  swaggerDefinition,
  apis: [
    './swagger/docs/**/*.yaml',
    './src/swagger/docs/**/*.yaml',
    './modules/**/*.yaml',
    './src/modules/**/*.yaml'
  ], 
};

const swaggerDocs = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
  const swaggerUiOptions = {
    swaggerOptions: {
      withCredentials: true,
      persistAuthorization: true
    }
  };

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUiOptions));

  app.get('/swagger.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
  });
}