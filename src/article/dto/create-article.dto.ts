import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  MaxLength,
  MinLength,
  ArrayMaxSize,
} from 'class-validator';
import { ArticleStatus } from '../entity/article.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({ 
    example: 'NestJS最佳实践', 
    description: '文章标题',
    minLength: 1,
    maxLength: 100
  })
  @IsString()
  @MinLength(1, { message: '文章标题不能为空' })
  @MaxLength(100, { message: '文章标题不能超过100个字符' })
  title: string;

  @ApiProperty({
    example: '本文详细讲解NestJS的核心功能...',
    description: '文章主体内容'
  })
  @IsString()
  @MinLength(1, { message: '文章内容不能为空' })
  content: string;

  @ApiProperty({
    example: '本文总结了NestJS框架的十大核心特性',
    description: '文章摘要',
    required: false,
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: '文章摘要不能超过500个字符' })
  summary?: string;

  @ApiProperty({
    example: 'https://example.com/cover.jpg',
    description: '文章封面图URL',
    required: false
  })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiProperty({
    example: [1, 3],
    description: '文章分类ID数组',
    type: [Number]
  })
  @IsArray()
  @ArrayMaxSize(5, { message: '一篇文章最多可以选择5个分类' })
  categoryIds: number[];

  @ApiProperty({
    example: [5, 7],
    description: '文章标签ID数组',
    required: false,
    type: [Number]
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20, { message: '一篇文章最多可以添加20个标签' })
  tagIds?: number[];

  @ApiProperty({
    enum: ArticleStatus,
    example: ArticleStatus.PUBLISHED,
    description: '文章状态'
  })
  @IsEnum(ArticleStatus)
  status: ArticleStatus;
}
