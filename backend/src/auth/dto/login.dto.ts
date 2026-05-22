// src/auth/dto/login.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ example: 'joao@aluno.edu' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @MinLength(6)
  password: string
}

// src/auth/dto/refresh.dto.ts
export class RefreshDto {
  @ApiProperty()
  @IsString()
  refreshToken: string
}
