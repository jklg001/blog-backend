import { PartialType } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({ 
    description: '评论内容', 
    example: '这是修改后的评论内容',
    minLength: 1,
    maxLength: 1000,
    required: false
  })
  @IsOptional()
  @IsString({ message: '评论内容必须是字符串' })
  @MinLength(1, { message: '评论内容不能为空' })
  @MaxLength(1000, { message: '评论内容不能超过1000个字符' })
  content?: string;
} 