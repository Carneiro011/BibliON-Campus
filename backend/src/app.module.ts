// src/app.module.ts
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { ResourcesModule } from './resources/resources.module'
import { SearchModule } from './search/search.module'
import { RatingsModule } from './ratings/ratings.module'
import { CommentsModule } from './comments/comments.module'
import { ModerationModule } from './moderation/moderation.module'
import { AiModule } from './ai/ai.module'
import { StorageModule } from './storage/storage.module'

@Module({
  imports: [
    // Configuração de variáveis de ambiente
    ConfigModule.forRoot({ isGlobal: true }),

    // Rate limiting: 100 requests por 60 segundos por IP
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    // Módulos da aplicação
    PrismaModule,
    AuthModule,
    UsersModule,
    ResourcesModule,
    SearchModule,
    RatingsModule,
    CommentsModule,
    ModerationModule,
    AiModule,
    StorageModule,
  ],
})
export class AppModule {}
