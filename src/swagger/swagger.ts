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
  // Servers hissəsi dinamik edildi: Canlıda Railway linkini, lokalda localhost-u götürəcək
  servers: [
    {
      url: process.env.RAILWAY_STATIC_URL 
        ? `https://${process.env.RAILWAY_STATIC_URL}` 
        : 'http://localhost:3000',
    },
  ],
  components: {
    securitySchemes: {
      customAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-auth-token',
        description: 'Statik və ya login token, Bearer olmadan',
      },
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'static-access',
        description: 'Statik API açarı',
      },
    },
  },
  security: [
    {
      customAuth: [],
    },
    {
      apiKeyAuth: [],
    },
  ],
};

const options: swaggerJsdoc.Options = {
  swaggerDefinition,
  // Yeni qovluq strukturuna uyğun .yaml fayllarının oxunma yolu
  // docs qovluğunun içində və ya onun alt qovluqlarında olan bütün .yaml-ları oxuyacaq
  apis: ['./src/swagger/docs/**/*.yaml'], 
};

const swaggerDocs = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
  // Swagger UI route-u
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  // JSON formatında görmək üçün
  app.get('/swagger.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
  });
}