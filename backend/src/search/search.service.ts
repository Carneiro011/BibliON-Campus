// src/search/search.service.ts
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ResourceStatus } from '@prisma/client'
import { Prisma } from '@prisma/client'

export interface SearchParams {
  q: string
  type?: string
  disciplineId?: string
  tags?: string[]
  page?: number
  limit?: number
}

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  /**
   * Busca full-text usando PostgreSQL nativo via Prisma $queryRaw.
   * Usa ts_vector + ts_query para relevância real.
   * Fallback para ILIKE se o query raw falhar.
   */
  async search(params: SearchParams) {
    const { q, type, disciplineId, page = 1, limit = 12 } = params
    const skip = (page - 1) * limit

    // Sanitizar query para evitar SQL injection no tsquery
    const safeQuery = q.trim().replace(/[^a-zA-Z0-9\u00C0-\u024F\s]/g, '').trim()

    if (!safeQuery) return { data: [], meta: { page, limit, total: 0 } }

    // Cláusulas condicionais com Prisma.sql / Prisma.empty (correto para queryRaw aninhado)
    const typeClause = type
      ? Prisma.sql`AND r.type = ${type}`
      : Prisma.empty
    const disciplineClause = disciplineId
      ? Prisma.sql`AND r.discipline_id = ${disciplineId}`
      : Prisma.empty

    // Full-text search com ranking por relevância usando Prisma $queryRaw
    const results = await this.prisma.$queryRaw<any[]>`
      SELECT
        r.id,
        r.title,
        r.description,
        r.type,
        r.url,
        r.summary,
        r.view_count,
        r.created_at,
        r.discipline_id,
        u.name AS user_name,
        u.avatar_url AS user_avatar,
        d.name AS discipline_name,
        d.color AS discipline_color,
        COALESCE(AVG(rt.stars), 0) AS avg_rating,
        COUNT(DISTINCT rt.id) AS rating_count,
        COUNT(DISTINCT c.id) AS comment_count,
        ts_rank(
          to_tsvector('portuguese', r.title || ' ' || COALESCE(r.description, '') || ' ' || COALESCE(r.summary, '')),
          plainto_tsquery('portuguese', ${safeQuery})
        ) AS rank
      FROM resources r
      INNER JOIN users u ON r.user_id = u.id
      LEFT JOIN disciplines d ON r.discipline_id = d.id
      LEFT JOIN ratings rt ON rt.resource_id = r.id
      LEFT JOIN comments c ON c.resource_id = r.id
      WHERE
        r.status = ${ResourceStatus.APPROVED}
        AND (
          to_tsvector('portuguese', r.title || ' ' || COALESCE(r.description, '') || ' ' || COALESCE(r.summary, ''))
          @@ plainto_tsquery('portuguese', ${safeQuery})
          OR r.title ILIKE ${'%' + safeQuery + '%'}
        )
        ${typeClause}
        ${disciplineClause}
      GROUP BY r.id, u.name, u.avatar_url, d.name, d.color
      ORDER BY rank DESC, r.view_count DESC
      LIMIT ${limit}
      OFFSET ${skip}
    `

    // Buscar tags separadamente (evita produto cartesiano)
    const resourceIds = results.map(r => r.id)
    const tagsByResource = resourceIds.length
      ? await this.prisma.resourceTag.findMany({
          where: { resourceId: { in: resourceIds } },
          include: { tag: true },
        })
      : []

    const tagsMap = tagsByResource.reduce((acc: any, rt) => {
      if (!acc[rt.resourceId]) acc[rt.resourceId] = []
      acc[rt.resourceId].push(rt.tag)
      return acc
    }, {})

    // Buscar total para paginação
    const [{ count }] = await this.prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count
      FROM resources r
      WHERE
        r.status = ${ResourceStatus.APPROVED}
        AND (
          to_tsvector('portuguese', r.title || ' ' || COALESCE(r.description, '') || ' ' || COALESCE(r.summary, ''))
          @@ plainto_tsquery('portuguese', ${safeQuery})
          OR r.title ILIKE ${'%' + safeQuery + '%'}
        )
    `

    return {
      data: results.map(r => ({
        ...r,
        tags: tagsMap[r.id] || [],
        avgRating: Number(r.avg_rating).toFixed(1),
        ratingCount: Number(r.rating_count),
        commentCount: Number(r.comment_count),
      })),
      meta: {
        query: q,
        page,
        limit,
        total: Number(count),
        pages: Math.ceil(Number(count) / limit),
      },
    }
  }

  // Busca de tags para autocomplete
  async searchTags(q: string) {
    return this.prisma.tag.findMany({
      where: { name: { contains: q, mode: 'insensitive' } },
      take: 10,
      orderBy: { resources: { _count: 'desc' } },
    })
  }

  // Disciplinas disponíveis
  async getDisciplines() {
    return this.prisma.discipline.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { resources: true } } },
    })
  }
}
