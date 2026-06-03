// src/main.ts
import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule)

  // Prefixo global da API
  app.setGlobalPrefix('api/v1')

  // CORS — aceita localhost e qualquer domínio vercel.app
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://bibli-on-campus.vercel.app',
      /\.vercel\.app$/,
    ],
    credentials: true,
  })

  // Validação global com class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // Remove campos não declarados no DTO
      forbidNonWhitelisted: true,
      transform: true,        // Transforma payloads para instâncias DTO
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  // Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('BibliON Campus API')
    .setDescription('Plataforma colaborativa de materiais acadêmicos com IA')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addTag('auth', 'Autenticação e sessão')
    .addTag('users', 'Gerenciamento de usuários')
    .addTag('resources', 'Recursos acadêmicos')
    .addTag('search', 'Busca e filtros')
    .addTag('ratings', 'Avaliações')
    .addTag('comments', 'Comentários')
    .addTag('moderation', 'Moderação de conteúdo')
    .addTag('ai', 'Inteligência artificial')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  })

  const port = process.env.PORT || 3001
  await app.listen(port)

  logger.log(`🚀 Backend rodando em: http://localhost:${port}`)
  logger.log(`📚 Swagger disponível em: http://localhost:${port}/api/docs`)
}

bootstrap()
