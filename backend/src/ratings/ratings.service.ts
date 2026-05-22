// src/ratings/ratings.service.ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async upsert(userId: string, resourceId: string, stars: number) {
    const resource = await this.prisma.resource.findUnique({ where: { id: resourceId } })
    if (!resource) throw new NotFoundException('Recurso não encontrado')

    return this.prisma.rating.upsert({
      where: { userId_resourceId: { userId, resourceId } },
      update: { stars },
      create: { userId, resourceId, stars },
    })
  }

  async getForResource(resourceId: string) {
    const ratings = await this.prisma.rating.findMany({
      where: { resourceId },
      select: { stars: true },
    })
    const avg = ratings.length
      ? ratings.reduce((s, r) => s + r.stars, 0) / ratings.length
      : 0
    return { avg: Math.round(avg * 10) / 10, total: ratings.length }
  }

  async getUserRating(userId: string, resourceId: string) {
    return this.prisma.rating.findUnique({
      where: { userId_resourceId: { userId, resourceId } },
    })
  }
}
