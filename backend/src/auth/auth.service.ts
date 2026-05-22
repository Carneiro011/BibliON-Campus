// src/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcryptjs'
import { PrismaService } from '../prisma/prisma.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // Valida usuário para o LocalStrategy
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user || !user.isActive) return null
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return null
    const { password: _, ...result } = user
    return result
  }

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (exists) throw new ConflictException('E-mail já cadastrado')

    const hash = await bcrypt.hash(dto.password, 10)
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hash,
        institution: dto.institution,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    const tokens = await this.generateTokens(user.id, user.email, user.role)
    await this.saveRefreshToken(user.id, tokens.refreshToken)
    return { user, ...tokens }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true, name: true, email: true, role: true, password: true, isActive: true },
    })

    if (!user || !user.isActive)
      throw new UnauthorizedException('Credenciais inválidas')

    const valid = await bcrypt.compare(dto.password, user.password)
    if (!valid) throw new UnauthorizedException('Credenciais inválidas')

    const { password: _, ...safeUser } = user
    const tokens = await this.generateTokens(safeUser.id, safeUser.email, safeUser.role)
    await this.saveRefreshToken(safeUser.id, tokens.refreshToken)

    return { user: safeUser, ...tokens }
  }

  async refresh(token: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: { select: { id: true, email: true, role: true, isActive: true } } },
    })

    if (!stored || stored.expiresAt < new Date() || !stored.user.isActive) {
      throw new UnauthorizedException('Refresh token inválido ou expirado')
    }

    // Rotação: invalida o token antigo e emite um novo
    await this.prisma.refreshToken.delete({ where: { token } })

    const tokens = await this.generateTokens(stored.user.id, stored.user.email, stored.user.role)
    await this.saveRefreshToken(stored.user.id, tokens.refreshToken)

    return tokens
  }

  async logout(token: string) {
    await this.prisma.refreshToken.deleteMany({ where: { token } })
    return { message: 'Logout realizado com sucesso' }
  }

  // --- Métodos privados ---

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role }

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
      }),
    ])

    return { accessToken, refreshToken }
  }

  private async saveRefreshToken(userId: string, token: string) {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    await this.prisma.refreshToken.create({
      data: { token, userId, expiresAt },
    })
  }
}
