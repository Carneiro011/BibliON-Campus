// src/comments/comments.controller.ts
import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { IsString, IsOptional, MinLength } from 'class-validator'
import { CommentsService } from './comments.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

class CreateCommentDto {
  @IsString() @MinLength(1) body: string
  @IsOptional() @IsString() parentId?: string
}

@ApiTags('comments')
@Controller('resources/:resourceId/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar comentários do recurso' })
  findAll(@Param('resourceId') resourceId: string) {
    return this.commentsService.findByResource(resourceId)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Comentar em um recurso' })
  create(
    @Param('resourceId') resourceId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.create(user.id, resourceId, dto.body, dto.parentId)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Remover comentário' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.commentsService.delete(id, user.id, user.role)
  }
}
