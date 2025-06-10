import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArticleStatus } from '../entity/article.entity';

export class AuthorInfoDto {
  @ApiProperty({
    description: '作者ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '作者用户名',
    example: 'zhangsan2024',
  })
  username: string;

  @ApiPropertyOptional({
    description: '作者头像URL',
    example: 'https://example.com/avatar.jpg',
  })
  avatar?: string;

  @ApiPropertyOptional({
    description: '作者个人简介',
    example: '热爱技术分享的程序员',
  })
  bio?: string;
}

export class CategoryInfoDto {
  @ApiProperty({
    description: '分类ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '分类名称',
    example: '技术教程',
  })
  name: string;
}

export class TagInfoDto {
  @ApiProperty({
    description: '标签ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '标签名称',
    example: 'NestJS',
  })
  name: string;
}

export class ArticleResponseDto {
  @ApiProperty({
    description: '文章ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '文章标题',
    example: 'NestJS 最佳实践指南',
  })
  title: string;

  @ApiProperty({
    description: '文章状态',
    enum: ArticleStatus,
    example: ArticleStatus.PUBLISHED,
  })
  status: ArticleStatus;

  @ApiProperty({
    description: '创建时间',
    example: '2023-12-01T10:30:00.000Z',
  })
  createdAt: string;

  @ApiPropertyOptional({
    description: '文章摘要',
    example: '本文总结了NestJS开发中的最佳实践',
  })
  summary?: string;

  @ApiPropertyOptional({
    description: '封面图片URL',
    example: 'https://example.com/cover.jpg',
  })
  coverImage?: string;

  @ApiProperty({
    description: '阅读次数',
    example: 1250,
  })
  viewCount: number;

  @ApiProperty({
    description: '点赞次数',
    example: 38,
  })
  likeCount: number;

  @ApiProperty({
    description: '评论数量',
    example: 15,
  })
  commentCount: number;

  @ApiProperty({
    description: '作者信息',
    type: AuthorInfoDto,
  })
  author: AuthorInfoDto;
}

export class ArticleDetailResponseDto extends ArticleResponseDto {
  @ApiProperty({
    description: '文章内容（Markdown格式）',
    example: '# NestJS 最佳实践\n\n这是一篇关于NestJS的详细教程...',
  })
  content: string;

  @ApiProperty({
    description: '文章分类列表',
    type: [CategoryInfoDto],
  })
  categories: CategoryInfoDto[];

  @ApiProperty({
    description: '文章标签列表',
    type: [TagInfoDto],
  })
  tags: TagInfoDto[];

  @ApiProperty({
    description: '当前用户是否已点赞',
    example: false,
  })
  liked: boolean;

  @ApiProperty({
    description: '当前用户是否已收藏',
    example: true,
  })
  saved: boolean;

  @ApiPropertyOptional({
    description: '发布时间',
    example: '2023-12-01T12:00:00.000Z',
  })
  publishedAt?: string;

  @ApiProperty({
    description: '更新时间',
    example: '2023-12-01T15:30:00.000Z',
  })
  updatedAt: string;
}

export class PaginationMetaDto {
  @ApiProperty({
    description: '当前页码',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: '每页数量',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: '总记录数',
    example: 156,
  })
  total: number;

  @ApiProperty({
    description: '总页数',
    example: 16,
  })
  totalPages: number;

  @ApiProperty({
    description: '是否有下一页',
    example: true,
  })
  hasNextPage: boolean;

  @ApiProperty({
    description: '是否有上一页',
    example: false,
  })
  hasPreviousPage: boolean;
}

export class ArticleListResponseDto {
  @ApiProperty({
    description: '文章列表',
    type: [ArticleResponseDto],
  })
  list: ArticleResponseDto[];

  @ApiProperty({
    description: '分页信息',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}
