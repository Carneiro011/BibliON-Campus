// src/users/users.controller.ts
import { Controller, Get, Put, Patch, Body, Param, UseGuards, Query } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { Roles } from '../common/decorators/roles.decorator'

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Perfil do usuário logado' })
  me(@CurrentUser() user: any) {
    return this.usersService.getProfile(user.id)
  }

  @Put('me')
  @ApiOperation({ summary: 'Atualizar perfil' })
  updateMe(@CurrentUser() user: any, @Body() dto: any) {
    return this.usersService.updateProfile(user.id, dto)
  }

  @Get('me/resources')
  @ApiOperation({ summary: 'Recursos enviados pelo usuário logado' })
  myResources(@CurrentUser() user: any) {
    return this.usersService.getUserResources(user.id, user.id, user.role)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Perfil público de um usuário' })
  getProfile(@Param('id') id: string) {
    return this.usersService.getProfile(id)
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Listar todos os usuários' })
  listAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.usersService.listAll(page, limit)
  }

  @Patch(':id/toggle-active')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '[Admin] Ativar/desativar usuário' })
  toggleActive(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.usersService.setActive(id, isActive)
  }
}
