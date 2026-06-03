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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true, name: true, email: true, role: true,
                avatarUrl: true, institution: true, bio: true, createdAt: true,
                _count: { select: { resources: true, ratings: true, comments: true } },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        return user;
    }
    async updateProfile(id, dto) {
        return this.prisma.user.update({
            where: { id },
            data: dto,
            select: { id: true, name: true, bio: true, institution: true, updatedAt: true },
        });
    }
    async getUserResources(userId, requesterId, requesterRole) {
        const targetId = requesterRole === client_1.Role.STUDENT ? requesterId : userId;
        return this.prisma.resource.findMany({
            where: { userId: targetId },
            orderBy: { createdAt: 'desc' },
            include: {
                discipline: { select: { name: true, color: true } },
                tags: { include: { tag: true } },
                _count: { select: { ratings: true, comments: true } },
            },
        });
    }
    async listAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
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
        ]);
        return { data, meta: { page, limit, total } };
    }
    async setActive(id, isActive) {
        return this.prisma.user.update({
            where: { id },
            data: { isActive },
            select: { id: true, name: true, isActive: true },
        });
    }
    async changeRole(id, role) {
        if (!Object.values(client_1.Role).includes(role)) {
            throw new Error(`Role inválida: ${role}`);
        }
        return this.prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, name: true, email: true, role: true },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map