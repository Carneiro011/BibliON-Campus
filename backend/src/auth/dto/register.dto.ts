// src/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string

  @ApiProperty({ example: 'joao@aluno.edu' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'senha123', minLength: 6 })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string

  @ApiPropertyOptional({ example: 'Universidade Federal do Ceará' })
  @IsOptional()
  @IsString()
  institution?: string
}
