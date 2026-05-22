// src/resources/resources.module.ts
import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { memoryStorage } from 'multer'
import { ResourcesController } from './resources.controller'
import { ResourcesService } from './resources.service'
import { PrismaModule } from '../prisma/prisma.module'
import { AiModule } from '../ai/ai.module'
import { StorageModule } from '../storage/storage.module'

@Module({
  imports: [
    MulterModule.register({ storage: memoryStorage() }),
    PrismaModule,
    AiModule,
    StorageModule,
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [ResourcesService],
})
export class ResourcesModule {}