// src/ai/ai.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { IsString, IsEnum, IsOptional } from 'class-validator'
import { AiService } from './ai.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'

class AnalyzeDto {
  @IsString() title: string
  @IsOptional() @IsString() description?: string
  @IsOptional() @IsString() url?: string
  @IsEnum(['pdf', 'link']) type: 'pdf' | 'link'
}

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('analyze')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Analisar material e gerar resumo + tags com IA' })
  async analyze(@Body() dto: AnalyzeDto): Promise<{ summary: string; tags: string[] }> {
    return this.aiService.analyzeResource(dto)
  }
}
