import { PartialType } from '@nestjs/swagger';
import { CreateArticleDto } from './create-article.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsEnum, MaxLength, MinLength, ArrayMaxSize } from 'class-validator';
import { ArticleStatus } from '../entity/article.entity';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  @ApiPropertyOptional({
    description: '文章标题',
    example: '更新后的文章标题',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({
    description: '文章内容',
    example: '更新后的文章内容...',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  content?: string;

  @ApiPropertyOptional({
    description: '文章摘要',
    example: '更新后的文章摘要',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @ApiPropertyOptional({
    description: '封面图片URL',
    example: 'https://example.com/new-cover.jpg',
  })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({
    description: '文章分类ID数组',
    example: [2, 4],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  categoryIds?: number[];

  @ApiPropertyOptional({
    description: '文章标签ID数组',
    example: [1, 3, 7],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  tagIds?: number[];

  @ApiPropertyOptional({
    description: '文章状态',
    enum: ArticleStatus,
    example: ArticleStatus.PUBLISHED,
  })
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;
} 