// src/auth/dto/refresh.dto.ts
import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RefreshDto {
  @ApiProperty()
  @IsString()
  refreshToken: string
}
