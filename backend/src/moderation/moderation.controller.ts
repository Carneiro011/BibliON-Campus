// src/moderation/moderation.controller.ts
import { Controller, Get, Post, Param, Body, UseGuards, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { Role } from '@prisma/client'
import { ModerationService } from './moderation.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'

class RejectDto {
  @IsString() reason: string
}

@ApiTags('moderation')
@Controller('moderation')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class ModerationController {
  constructor(private moderationService: ModerationService) {}

  @Get('pending')
  @Roles(Role.MODERATOR, Role.ADMIN)
  @ApiOperation({ summary: 'Listar recursos aguardando moderação' })
  getPending(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.moderationService.getPending(page, limit)
  }

  @Get('stats')
  @Roles(Role.MODERATOR, Role.ADMIN)
  @ApiOperation({ summary: 'Estatísticas de moderação' })
  getStats() {
    return this.moderationService.getStats()
  }

  @Post(':id/approve')
  @Roles(Role.MODERATOR, Role.ADMIN)
  @ApiOperation({ summary: 'Aprovar recurso' })
  approve(@Param('id') id: string, @CurrentUser() user: any) {
    return this.moderationService.approve(id, user.id)
  }

  @Post(':id/reject')
  @Roles(Role.MODERATOR, Role.ADMIN)
  @ApiOperation({ summary: 'Rejeitar recurso com motivo' })
  reject(@Param('id') id: string, @CurrentUser() user: any, @Body() dto: RejectDto) {
    return this.moderationService.reject(id, user.id, dto.reason)
  }

  @Post(':id/ai-check')
  @Roles(Role.MODERATOR, Role.ADMIN)
  @ApiOperation({ summary: 'Pré-moderação automática com IA' })
  aiCheck(@Param('id') id: string) {
    return this.moderationService.aiPreModerate(id)
  }
}
