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
exports.ModerationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_service_1 = require("../ai/ai.service");
const client_1 = require("@prisma/client");
let ModerationService = class ModerationService {
    constructor(prisma, ai) {
        this.prisma = prisma;
        this.ai = ai;
    }
    async getPending(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.resource.findMany({
                where: { status: client_1.ResourceStatus.PENDING },
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
            this.prisma.resource.count({ where: { status: client_1.ResourceStatus.PENDING } }),
        ]);
        return { data, meta: { page, limit, total } };
    }
    async approve(resourceId, moderatorId) {
        const resource = await this.prisma.resource.findUnique({ where: { id: resourceId } });
        if (!resource)
            throw new common_1.NotFoundException();
        await this.prisma.$transaction([
            this.prisma.resource.update({
                where: { id: resourceId },
                data: { status: client_1.ResourceStatus.APPROVED },
            }),
            this.prisma.moderation.upsert({
                where: { resourceId },
                update: {
                    status: client_1.ResourceStatus.APPROVED,
                    moderatorId,
                    reviewedAt: new Date(),
                },
                create: {
                    resourceId,
                    moderatorId,
                    status: client_1.ResourceStatus.APPROVED,
                    reviewedAt: new Date(),
                },
            }),
        ]);
        return { message: 'Recurso aprovado com sucesso' };
    }
    async reject(resourceId, moderatorId, reason) {
        const resource = await this.prisma.resource.findUnique({ where: { id: resourceId } });
        if (!resource)
            throw new common_1.NotFoundException();
        await this.prisma.$transaction([
            this.prisma.resource.update({
                where: { id: resourceId },
                data: { status: client_1.ResourceStatus.REJECTED },
            }),
            this.prisma.moderation.upsert({
                where: { resourceId },
                update: {
                    status: client_1.ResourceStatus.REJECTED,
                    moderatorId,
                    reason,
                    reviewedAt: new Date(),
                },
                create: {
                    resourceId,
                    moderatorId,
                    status: client_1.ResourceStatus.REJECTED,
                    reason,
                    reviewedAt: new Date(),
                },
            }),
        ]);
        return { message: 'Recurso rejeitado' };
    }
    async aiPreModerate(resourceId) {
        const resource = await this.prisma.resource.findUnique({ where: { id: resourceId } });
        if (!resource)
            throw new common_1.NotFoundException();
        const flags = await this.ai.moderateContent(resource.title, resource.description || undefined);
        await this.prisma.moderation.update({
            where: { resourceId },
            data: { aiFlags: flags },
        });
        return { resourceId, flags };
    }
    async getStats() {
        const [pending, approved, rejected] = await Promise.all([
            this.prisma.resource.count({ where: { status: client_1.ResourceStatus.PENDING } }),
            this.prisma.resource.count({ where: { status: client_1.ResourceStatus.APPROVED } }),
            this.prisma.resource.count({ where: { status: client_1.ResourceStatus.REJECTED } }),
        ]);
        return { pending, approved, rejected, total: pending + approved + rejected };
    }
};
exports.ModerationService = ModerationService;
exports.ModerationService = ModerationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_service_1.AiService])
], ModerationService);
//# sourceMappingURL=moderation.service.js.map