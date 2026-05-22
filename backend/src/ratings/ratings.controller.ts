// src/ratings/ratings.controller.ts
import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { IsInt, Min, Max } from 'class-validator'
import { RatingsService } from './ratings.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

class RateDto { @IsInt() @Min(1) @Max(5) stars: number }

@ApiTags('ratings')
@Controller('resources/:resourceId/ratings')
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Get()
  @ApiOperation({ summary: 'Média de avaliações do recurso' })
  getForResource(@Param('resourceId') resourceId: string) {
    return this.ratingsService.getForResource(resourceId)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Avaliar recurso (upsert)' })
  upsert(
    @Param('resourceId') resourceId: string,
    @CurrentUser() user: any,
    @Body() dto: RateDto,
  ) {
    return this.ratingsService.upsert(user.id, resourceId, dto.stars)
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Minha avaliação para este recurso' })
  myRating(@Param('resourceId') resourceId: string, @CurrentUser() user: any) {
    return this.ratingsService.getUserRating(user.id, resourceId)
  }
}
