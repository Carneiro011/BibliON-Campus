// src/resources/dto/create-resource.dto.ts
import { IsString, IsEnum, IsOptional, IsArray, IsUrl, MinLength, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ResourceType } from '@prisma/client'

export class CreateResourceDto {
  @ApiProperty({ example: 'Introdução a Grafos' })
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string

  @ApiProperty({ enum: ResourceType })
  @IsEnum(ResourceType)
  type: ResourceType

  @ApiPropertyOptional({ description: 'URL para links externos (não PDF)' })
  @IsOptional()
  @IsString()
  url?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  summary?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  disciplineId?: string

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]
}
