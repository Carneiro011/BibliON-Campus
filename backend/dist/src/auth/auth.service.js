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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive)
            return null;
        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            return null;
        const { password: _, ...result } = user;
        return result;
    }
    async register(dto) {
        const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (exists)
            throw new common_1.ConflictException('E-mail já cadastrado');
        const hash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: hash,
                institution: dto.institution,
            },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });
        const tokens = await this.generateTokens(user.id, user.email, user.role);
        await this.saveRefreshToken(user.id, tokens.refreshToken);
        return { user, ...tokens };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: { id: true, name: true, email: true, role: true, password: true, isActive: true },
        });
        if (!user || !user.isActive)
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        const { password: _, ...safeUser } = user;
        const tokens = await this.generateTokens(safeUser.id, safeUser.email, safeUser.role);
        await this.saveRefreshToken(safeUser.id, tokens.refreshToken);
        return { user: safeUser, ...tokens };
    }
    async refresh(token) {
        const stored = await this.prisma.refreshToken.findUnique({
            where: { token },
            include: { user: { select: { id: true, email: true, role: true, isActive: true } } },
        });
        if (!stored || stored.expiresAt < new Date() || !stored.user.isActive) {
            throw new common_1.UnauthorizedException('Refresh token inválido ou expirado');
        }
        await this.prisma.refreshToken.delete({ where: { token } });
        const tokens = await this.generateTokens(stored.user.id, stored.user.email, stored.user.role);
        await this.saveRefreshToken(stored.user.id, tokens.refreshToken);
        return tokens;
    }
    async logout(token) {
        await this.prisma.refreshToken.deleteMany({ where: { token } });
        return { message: 'Logout realizado com sucesso' };
    }
    async generateTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwt.signAsync(payload, {
                secret: this.config.get('JWT_SECRET'),
                expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
            }),
            this.jwt.signAsync(payload, {
                secret: this.config.get('JWT_REFRESH_SECRET'),
                expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async saveRefreshToken(userId, token) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.prisma.refreshToken.create({
            data: { token, userId, expiresAt },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map