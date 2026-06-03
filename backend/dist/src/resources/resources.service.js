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
exports.ResourcesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_service_1 = require("../ai/ai.service");
const storage_service_1 = require("../storage/storage.service");
const client_1 = require("@prisma/client");
let ResourcesService = class ResourcesService {
    constructor(prisma, ai, storage) {
        this.prisma = prisma;
        this.ai = ai;
        this.storage = storage;
    }
    async create(userId, dto, file) {
        if (dto.type === client_1.ResourceType.PDF && !file) {
            throw new common_1.BadRequestException('Recursos do tipo PDF exigem o envio de um arquivo');
        }
        if (dto.type !== client_1.ResourceType.PDF && !dto.url) {
            throw new common_1.BadRequestException('Recursos de link/vídeo/artigo exigem uma URL');
        }
        if (file && dto.type !== client_1.ResourceType.PDF) {
            throw new common_1.BadRequestException('Arquivo só é aceito para recursos do tipo PDF');
        }
        let url = dto.url || '';
        let fileSize;
        let aiSummary;
        let aiTags = [];
        let fileBuffer;
        if (file) {
            const uploadResult = await this.storage.uploadPdf(file, userId);
            url = uploadResult.url;
            fileSize = file.size;
            fileBuffer = file.buffer;
        }
        else if (dto.url) {
            const result = await this.ai.analyzeResource({
                type: 'link',
                url: dto.url,
                title: dto.title,
                description: dto.description,
            }).catch(() => ({ summary: '', tags: [] }));
            aiSummary = result.summary;
            aiTags = result.tags;
        }
        const tagIds = await this.resolveTagIds([
            ...(dto.tags || []),
            ...aiTags,
        ]);
        const resource = await this.prisma.resource.create({
            data: {
                title: dto.title,
                description: dto.description,
                type: dto.type,
                url,
                fileSize,
                summary: dto.summary || aiSummary,
                userId,
                disciplineId: dto.disciplineId,
                status: client_1.ResourceStatus.PENDING,
                tags: { create: tagIds.map(tagId => ({ tagId })) },
            },
            include: {
                user: { select: { id: true, name: true, avatarUrl: true } },
                discipline: true,
                tags: { include: { tag: true } },
            },
        });
        await this.prisma.moderation.create({
            data: { resourceId: resource.id, status: client_1.ResourceStatus.PENDING },
        });
        if (fileBuffer) {
            const resourceId = resource.id;
            const title = dto.title;
            this.ai
                .analyzeResource({ type: 'pdf', buffer: fileBuffer, title })
                .then(async (result) => {
                if (result.summary) {
                    await this.prisma.resource.update({
                        where: { id: resourceId },
                        data: { summary: result.summary },
                    });
                }
            })
                .catch(() => { });
        }
        return resource;
    }
    async findAll(params) {
        const page = Number(params.page) || 1;
        const limit = Number(params.limit) || 12;
        const { type, disciplineId, status = client_1.ResourceStatus.APPROVED } = params;
        const skip = (page - 1) * limit;
        const where = {
            status,
            ...(type && { type }),
            ...(disciplineId && { disciplineId }),
        };
        const [data, total] = await Promise.all([
            this.prisma.resource.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { id: true, name: true, avatarUrl: true } },
                    discipline: { select: { id: true, name: true, color: true } },
                    tags: { include: { tag: { select: { id: true, name: true } } } },
                    _count: { select: { ratings: true, comments: true } },
                    ratings: { select: { stars: true } },
                },
            }),
            this.prisma.resource.count({ where }),
        ]);
        return {
            data: data.map((r) => this.formatResource(r)),
            meta: { page, limit, total, pages: Math.ceil(total / limit) },
        };
    }
    async findOne(id) {
        const resource = await this.prisma.resource.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, avatarUrl: true, institution: true } },
                discipline: true,
                tags: { include: { tag: true } },
                ratings: { select: { stars: true, userId: true } },
                _count: { select: { comments: true } },
            },
        });
        if (!resource)
            throw new common_1.NotFoundException('Recurso não encontrado');
        await this.prisma.resource.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
        return this.formatResource(resource);
    }
    async update(id, userId, role, dto) {
        const resource = await this.prisma.resource.findUnique({ where: { id } });
        if (!resource)
            throw new common_1.NotFoundException();
        if (resource.userId !== userId && role === client_1.Role.STUDENT)
            throw new common_1.ForbiddenException('Você não pode editar este recurso');
        const tagIds = dto.tags ? await this.resolveTagIds(dto.tags) : undefined;
        return this.prisma.resource.update({
            where: { id },
            data: {
                title: dto.title,
                description: dto.description,
                summary: dto.summary,
                disciplineId: dto.disciplineId,
                ...(tagIds && {
                    tags: {
                        deleteMany: {},
                        create: tagIds.map(tagId => ({ tagId })),
                    },
                }),
            },
            include: {
                tags: { include: { tag: true } },
                discipline: true,
            },
        });
    }
    async remove(id, userId, role) {
        const resource = await this.prisma.resource.findUnique({ where: { id } });
        if (!resource)
            throw new common_1.NotFoundException();
        if (resource.userId !== userId && role === client_1.Role.STUDENT)
            throw new common_1.ForbiddenException();
        await this.prisma.resource.delete({ where: { id } });
        return { message: 'Recurso removido com sucesso' };
    }
    async generateAiSummary(id) {
        const resource = await this.prisma.resource.findUnique({ where: { id } });
        if (!resource)
            throw new common_1.NotFoundException();
        const result = await this.ai.analyzeResource({
            type: resource.type === client_1.ResourceType.PDF ? 'pdf' : 'link',
            url: resource.url,
            title: resource.title,
            description: resource.description || undefined,
        });
        return this.prisma.resource.update({
            where: { id },
            data: { summary: result.summary },
        });
    }
    async resolveTagIds(tagNames) {
        const unique = [...new Set(tagNames.map(t => t.toLowerCase().trim()))].filter(Boolean);
        const ids = [];
        for (const name of unique) {
            const slug = name
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '-');
            const tag = await this.prisma.tag.upsert({
                where: { slug },
                update: {},
                create: { name, slug },
            });
            ids.push(tag.id);
        }
        return ids;
    }
    formatResource(resource) {
        const avgRating = resource.ratings?.length
            ? resource.ratings.reduce((sum, r) => sum + r.stars, 0) / resource.ratings.length
            : null;
        return {
            ...resource,
            tags: resource.tags?.map((rt) => rt.tag),
            avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
            ratingCount: resource.ratings?.length || 0,
            ratings: undefined,
        };
    }
};
exports.ResourcesService = ResourcesService;
exports.ResourcesService = ResourcesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService,
        storage_service_1.StorageService])
], ResourcesService);
//# sourceMappingURL=resources.service.js.map