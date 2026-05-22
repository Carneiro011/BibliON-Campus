// src/resources/resources.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AiService, AiAnalysisResult } from '../ai/ai.service'
import { StorageService } from '../storage/storage.service'
import { CreateResourceDto } from './dto/create-resource.dto'
import { UpdateResourceDto } from './dto/update-resource.dto'
import { ResourceType, ResourceStatus, Role } from '@prisma/client'

@Injectable()
export class ResourcesService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService,
    private storage: StorageService,
  ) {}

  async create(
    userId: string,
    dto: CreateResourceDto,
    file?: Express.Multer.File,
  ) {
    let url = dto.url || ''
    let fileSize: number | undefined
    let aiSummary: string | undefined
    let aiTags: string[] = []

    if (file) {
      if (dto.type !== ResourceType.PDF) {
        throw new BadRequestException('Arquivo só é aceito para recursos do tipo PDF')
      }
      const uploadResult = await this.storage.uploadPdf(file, userId)
      url = uploadResult.url
      fileSize = file.size

      const tagIds = await this.resolveTagIds(dto.tags || [])

      const resource = await this.prisma.resource.create({
        data: {
          title: dto.title,
          description: dto.description,
          type: dto.type,
          url,
          fileSize,
          summary: dto.summary,
          userId,
          disciplineId: dto.disciplineId,
          status: ResourceStatus.PENDING,
          tags: { create: tagIds.map(tagId => ({ tagId })) },
        },
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
          discipline: true,
          tags: { include: { tag: true } },
        },
      })

      await this.prisma.moderation.create({
        data: { resourceId: resource.id, status: ResourceStatus.PENDING },
      })

      const resourceId = resource.id
      const fileBuffer = file.buffer
      const title = dto.title

      this.ai
        .analyzeResource({ type: 'pdf', buffer: fileBuffer, title })
        .then(async (result: AiAnalysisResult) => {
          if (result.summary) {
            await this.prisma.resource.update({
              where: { id: resourceId },
              data: { summary: result.summary },
            })
          }
        })
        .catch(() => { /* Falha silenciosa */ })

      return resource

    } else if (dto.url && dto.type !== ResourceType.PDF) {
      const result = await this.ai.analyzeResource({
        type: 'link',
        url: dto.url,
        title: dto.title,
        description: dto.description,
      }).catch((): AiAnalysisResult => ({ summary: '', tags: [] }))

      aiSummary = result.summary
      aiTags = result.tags
    }

    const tagIds = await this.resolveTagIds([
      ...(dto.tags || []),
      ...aiTags,
    ])

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
        status: ResourceStatus.PENDING,
        tags: { create: tagIds.map(tagId => ({ tagId })) },
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        discipline: true,
        tags: { include: { tag: true } },
      },
    })

    await this.prisma.moderation.create({
      data: { resourceId: resource.id, status: ResourceStatus.PENDING },
    })

    return resource
  }

  async findAll(params: {
    page?: number
    limit?: number
    type?: ResourceType
    disciplineId?: string
    status?: ResourceStatus
  }) {
    const page = Number(params.page) || 1
    const limit = Number(params.limit) || 12
    const { type, disciplineId, status = ResourceStatus.APPROVED } = params
    const skip = (page - 1) * limit

    const where = {
      status,
      ...(type && { type }),
      ...(disciplineId && { disciplineId }),
    }

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
    ])

    return {
      data: data.map((r: any) => this.formatResource(r)),
      meta: { page, limit, total, pages: Math.ceil(total / limit) },
    }
  }

  async findOne(id: string) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true, institution: true } },
        discipline: true,
        tags: { include: { tag: true } },
        ratings: { select: { stars: true, userId: true } },
        _count: { select: { comments: true } },
      },
    })

    if (!resource) throw new NotFoundException('Recurso não encontrado')

    await this.prisma.resource.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    })

    return this.formatResource(resource)
  }

  async update(id: string, userId: string, role: Role, dto: UpdateResourceDto) {
    const resource = await this.prisma.resource.findUnique({ where: { id } })
    if (!resource) throw new NotFoundException()
    if (resource.userId !== userId && role === Role.STUDENT)
      throw new ForbiddenException('Você não pode editar este recurso')

    const tagIds = dto.tags ? await this.resolveTagIds(dto.tags) : undefined

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
    })
  }

  async remove(id: string, userId: string, role: Role) {
    const resource = await this.prisma.resource.findUnique({ where: { id } })
    if (!resource) throw new NotFoundException()
    if (resource.userId !== userId && role === Role.STUDENT)
      throw new ForbiddenException()

    await this.prisma.resource.delete({ where: { id } })
    return { message: 'Recurso removido com sucesso' }
  }

  async generateAiSummary(id: string) {
    const resource = await this.prisma.resource.findUnique({ where: { id } })
    if (!resource) throw new NotFoundException()

    const result = await this.ai.analyzeResource({
      type: resource.type === ResourceType.PDF ? 'pdf' : 'link',
      url: resource.url,
      title: resource.title,
      description: resource.description || undefined,
    })

    return this.prisma.resource.update({
      where: { id },
      data: { summary: result.summary },
    })
  }

  private async resolveTagIds(tagNames: string[]): Promise<string[]> {
    const unique = [...new Set(tagNames.map(t => t.toLowerCase().trim()))].filter(Boolean)
    const ids: string[] = []

    for (const name of unique) {
      const slug = name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-')
      const tag = await this.prisma.tag.upsert({
        where: { slug },
        update: {},
        create: { name, slug },
      })
      ids.push(tag.id)
    }

    return ids
  }

  private formatResource(resource: any) {
    const avgRating = resource.ratings?.length
      ? resource.ratings.reduce((sum: number, r: any) => sum + r.stars, 0) / resource.ratings.length
      : null

    return {
      ...resource,
      tags: resource.tags?.map((rt: any) => rt.tag),
      avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null,
      ratingCount: resource.ratings?.length || 0,
      ratings: undefined,
    }
  }
}
