import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Sécurité
  app.use(helmet());
  app.enableCors({
    // Plusieurs origines possibles, séparées par des virgules :
    // CORS_ORIGIN=https://mon-site.vercel.app,https://mon-domaine.com
    // (en dev, fallback sur http://localhost:3001)
    origin: (process.env.CORS_ORIGIN || 'http://localhost:3001')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
    methods: 'GET,POST,PUT,PATCH,DELETE',
    credentials: true,
    // Expose Content-Disposition pour que le frontend puisse lire le nom
    // de fichier des téléchargements (sinon il tombe sur "document-<id>.bin").
    exposedHeaders: ['Content-Disposition', 'Content-Length'],
  });

  // Guards globaux : JWT par défaut sur tout, sauf routes marquées @Public()
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  // Validation globale
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Prefix API
  app.setGlobalPrefix('api');

  // Logging
  app.useLogger(new Logger());

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('API ARD Ziguinchor')
    .setDescription("Documentation de l'API du portail de l'ARD de Ziguinchor")
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = Number(process.env.PORT) || 3000;

  await app.listen(port, '0.0.0.0');
}
bootstrap();
