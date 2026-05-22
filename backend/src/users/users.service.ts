// src/users/users.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Role } from '@prisma/client'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, name: true, email: true, role: true,
        avatarUrl: true, institution: true, bio: true, createdAt: true,
        _count: { select: { resources: true, ratings: true, comments: true } },
      },
    })
    if (!user) throw new NotFoundException('Usuário não encontrado')
    return user
  }

  async updateProfile(id: string, dto: { name?: string; bio?: string; institution?: string }) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, name: true, bio: true, institution: true, updatedAt: true },
    })
  }

  async getUserResources(userId: string, requesterId: string, requesterRole: Role) {
    // Aluno só vê seus próprios recursos; moderador/admin vê de qualquer um
    const targetId = requesterRole === Role.STUDENT ? requesterId : userId
    return this.prisma.resource.findMany({
      where: { userId: targetId },
      orderBy: { createdAt: 'desc' },
      include: {
        discipline: { select: { name: true, color: true } },
        tags: { include: { tag: true } },
        _count: { select: { ratings: true, comments: true } },
      },
    })
  }

  // Apenas admin
  async listAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip, take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, name: true, email: true, role: true,
          institution: true, isActive: true, createdAt: true,
          _count: { select: { resources: true } },
        },
      }),
      this.prisma.user.count(),
    ])
    return { data, meta: { page, limit, total } }
  }

  async setActive(id: string, isActive: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive },
      select: { id: true, name: true, isActive: true },
    })
  }
}
