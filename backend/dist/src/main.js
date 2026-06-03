"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1');
    app.enableCors({
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('BibliON Campus API')
        .setDescription('Plataforma colaborativa de materiais acadêmicos com IA')
        .setVersion('1.0')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
        .addTag('auth', 'Autenticação e sessão')
        .addTag('users', 'Gerenciamento de usuários')
        .addTag('resources', 'Recursos acadêmicos')
        .addTag('search', 'Busca e filtros')
        .addTag('ratings', 'Avaliações')
        .addTag('comments', 'Comentários')
        .addTag('moderation', 'Moderação de conteúdo')
        .addTag('ai', 'Inteligência artificial')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: { persistAuthorization: true },
    });
    const port = process.env.PORT || 3001;
    await app.listen(port);
    logger.log(`🚀 Backend rodando em: http://localhost:${port}`);
    logger.log(`📚 Swagger disponível em: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map