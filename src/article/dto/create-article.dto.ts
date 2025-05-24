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

export class CreateArticleDto {
  @IsString()
  @MinLength(1, { message: '文章标题不能为空' })
  @MaxLength(100, { message: '文章标题不能超过100个字符' })
  title: string;

  @IsString()
  @MinLength(1, { message: '文章内容不能为空' })
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: '文章摘要不能超过500个字符' })
  summary?: string;

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsArray()
  @ArrayMaxSize(5, { message: '一篇文章最多可以选择5个分类' })
  categoryIds: number[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20, { message: '一篇文章最多可以添加20个标签' })
  tagIds?: number[];

  @IsEnum(ArticleStatus)
  status: ArticleStatus;
}
