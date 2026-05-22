// src/moderation/moderation.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AiService } from '../ai/ai.service'
import { ResourceStatus } from '@prisma/client'

@Injectable()
export class ModerationService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService,
  ) {}

  // Listar recursos pendentes de moderação
  async getPending(page = 1, limit = 20) {
    const skip = (page - 1) * limit
    const [data, total] = await Promise.all([
      this.prisma.resource.findMany({
        where: { status: ResourceStatus.PENDING },
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          discipline: { select: { name: true } },
          moderation: true,
          tags: { include: { tag: true } },
        },
      }),
      this.prisma.resource.count({ where: { status: ResourceStatus.PENDING } }),
    ])
    return { data, meta: { page, limit, total } }
  }

  // Aprovar recurso
  async approve(resourceId: string, moderatorId: string) {
    const resource = await this.prisma.resource.findUnique({ where: { id: resourceId } })
    if (!resource) throw new NotFoundException()

    await this.prisma.$transaction([
      this.prisma.resource.update({
        where: { id: resourceId },
        data: { status: ResourceStatus.APPROVED },
      }),
      this.prisma.moderation.upsert({
        where: { resourceId },
        update: {
          status: ResourceStatus.APPROVED,
          moderatorId,
          reviewedAt: new Date(),
        },
        create: {
          resourceId,
          moderatorId,
          status: ResourceStatus.APPROVED,
          reviewedAt: new Date(),
        },
      }),
    ])

    return { message: 'Recurso aprovado com sucesso' }
  }

  // Rejeitar recurso com motivo
  async reject(resourceId: string, moderatorId: string, reason: string) {
    const resource = await this.prisma.resource.findUnique({ where: { id: resourceId } })
    if (!resource) throw new NotFoundException()

    await this.prisma.$transaction([
      this.prisma.resource.update({
        where: { id: resourceId },
        data: { status: ResourceStatus.REJECTED },
      }),
      this.prisma.moderation.upsert({
        where: { resourceId },
        update: {
          status: ResourceStatus.REJECTED,
          moderatorId,
          reason,
          reviewedAt: new Date(),
        },
        create: {
          resourceId,
          moderatorId,
          status: ResourceStatus.REJECTED,
          reason,
          reviewedAt: new Date(),
        },
      }),
    ])

    return { message: 'Recurso rejeitado' }
  }

  // Pré-moderar com IA antes de exibir para moderador humano
  async aiPreModerate(resourceId: string) {
    const resource = await this.prisma.resource.findUnique({ where: { id: resourceId } })
    if (!resource) throw new NotFoundException()

    const flags = await this.ai.moderateContent(resource.title, resource.description || undefined)

    await this.prisma.moderation.update({
      where: { resourceId },
      data: { aiFlags: flags },
    })

    return { resourceId, flags }
  }

  // Estatísticas de moderação
  async getStats() {
    const [pending, approved, rejected] = await Promise.all([
      this.prisma.resource.count({ where: { status: ResourceStatus.PENDING } }),
      this.prisma.resource.count({ where: { status: ResourceStatus.APPROVED } }),
      this.prisma.resource.count({ where: { status: ResourceStatus.REJECTED } }),
    ])
    return { pending, approved, rejected, total: pending + approved + rejected }
  }
}
