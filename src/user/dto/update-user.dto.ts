import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsUrl,
} from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: '用户昵称',
    example: '新的昵称',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: '昵称长度不能超过50个字符' })
  nickname?: string;

  @ApiPropertyOptional({
    description: '头像URL',
    example: 'https://example.com/new-avatar.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: '头像URL格式不正确' })
  avatar?: string;

  @ApiPropertyOptional({
    description: '个人简介',
    example: '这是我的新个人简介',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: '个人简介长度不能超过500个字符' })
  bio?: string;
} 