// src/moderation/moderation.module.ts
import { Module } from '@nestjs/common'
import { ModerationController } from './moderation.controller'
import { ModerationService } from './moderation.service'
import { PrismaModule } from '../prisma/prisma.module'
import { AiModule } from '../ai/ai.module'

@Module({
  imports: [PrismaModule, AiModule],
  controllers: [ModerationController],
  providers: [ModerationService],
  exports: [ModerationService],
})
export class ModerationModule {}
