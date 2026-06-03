"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
let SearchService = class SearchService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async search(params) {
        const { q, type, disciplineId, page = 1, limit = 12 } = params;
        const skip = (page - 1) * limit;
        const safeQuery = q.trim().replace(/[^a-zA-Z0-9\u00C0-\u024F\s]/g, '').trim();
        if (!safeQuery)
            return { data: [], meta: { page, limit, total: 0 } };
        const typeClause = type
            ? client_2.Prisma.sql `AND r.type = ${type}`
            : client_2.Prisma.empty;
        const disciplineClause = disciplineId
            ? client_2.Prisma.sql `AND r.discipline_id = ${disciplineId}`
            : client_2.Prisma.empty;
        const results = await this.prisma.$queryRaw `
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
        r.status = ${client_1.ResourceStatus.APPROVED}
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
    `;
        const resourceIds = results.map(r => r.id);
        const tagsByResource = resourceIds.length
            ? await this.prisma.resourceTag.findMany({
                where: { resourceId: { in: resourceIds } },
                include: { tag: true },
            })
            : [];
        const tagsMap = tagsByResource.reduce((acc, rt) => {
            if (!acc[rt.resourceId])
                acc[rt.resourceId] = [];
            acc[rt.resourceId].push(rt.tag);
            return acc;
        }, {});
        const [{ count }] = await this.prisma.$queryRaw `
      SELECT COUNT(*) as count
      FROM resources r
      WHERE
        r.status = ${client_1.ResourceStatus.APPROVED}
        AND (
          to_tsvector('portuguese', r.title || ' ' || COALESCE(r.description, '') || ' ' || COALESCE(r.summary, ''))
          @@ plainto_tsquery('portuguese', ${safeQuery})
          OR r.title ILIKE ${'%' + safeQuery + '%'}
        )
    `;
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
        };
    }
    async searchTags(q) {
        return this.prisma.tag.findMany({
            where: { name: { contains: q, mode: 'insensitive' } },
            take: 10,
            orderBy: { resources: { _count: 'desc' } },
        });
    }
    async getDisciplines() {
        return this.prisma.discipline.findMany({
            orderBy: { name: 'asc' },
            include: { _count: { select: { resources: true } } },
        });
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchService);
//# sourceMappingURL=search.service.js.map