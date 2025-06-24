import {
  IsString,
  IsNumber,
  IsOptional,
  MinLength,
  MaxLength,
  IsPositive,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCommentDto {
  @ApiProperty({
    description: '评论内容',
    example: '这是一条很棒的文章！',
    minLength: 1,
    maxLength: 1000,
  })
  @IsString({ message: '评论内容必须是字符串' })
  @MinLength(1, { message: '评论内容不能为空' })
  @MaxLength(1000, { message: '评论内容不能超过1000个字符' })
  content: string;

  @ApiProperty({
    description: '文章ID',
    example: 1,
  })
  @Type(() => Number)
  @IsNumber({}, { message: '文章ID必须是数字' })
  @IsPositive({ message: '文章ID必须是正数' })
  articleId: number;

  @ApiProperty({
    description: '父评论ID（回复评论时需要）',
    example: 2,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '父评论ID必须是数字' })
  @IsPositive({ message: '父评论ID必须是正数' })
  parentId?: number;
}