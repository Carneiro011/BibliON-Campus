// src/comments/comments.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Role } from '@prisma/client'

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, resourceId: string, body: string, parentId?: string) {
    const resource = await this.prisma.resource.findUnique({ where: { id: resourceId } })
    if (!resource) throw new NotFoundException()

    return this.prisma.comment.create({
      data: { body, userId, resourceId, parentId },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    })
  }

  async findByResource(resourceId: string) {
    const comments = await this.prisma.comment.findMany({
      where: { resourceId, parentId: null }, // Somente comentários raiz
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        replies: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    })
    return comments
  }

  async delete(id: string, userId: string, role: Role) {
    const comment = await this.prisma.comment.findUnique({ where: { id } })
    if (!comment) throw new NotFoundException()
    if (comment.userId !== userId && role === Role.STUDENT)
      throw new ForbiddenException()

    await this.prisma.comment.delete({ where: { id } })
    return { message: 'Comentário removido' }
  }
}
